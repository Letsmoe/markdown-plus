#!/usr/bin/env node

/**
 * We want to add some extra flavour to markdown files.
 *
 * Meaning when we edit we don't always want to resolve files, we can construct
 * a list of all files that we have to resolve a specific name from.
 *
 * Imagine this input: !`false` There might be a file somewhere called
 * "false.mpp" inside the "datatypes" directory.
 *
 * We search the source directory to construct this list on each compilation run
 * and replace this kind of syntax with proper markdown links.
 */

import * as fs from "fs";
import * as stringSimilarity from "string-similarity";
import * as path from "path";
import { warn } from "./console-dispatcher.js";
import { Config, validateConfig } from "./config.js";
import Showdown from "showdown";
import { Environment, evaluate, InputStream, parse, TokenStream } from "@gyro-lang/core";
import { DependencyGraph, getDependencies } from "./dependencies/index.js";
const RESOLVE_SYNTAX = /\[\[(.*?)\]\]/g

const changeExtension = (file: string, ext: string) => {
	return file.substring(0, file.lastIndexOf(".")) + "." + ext;
};

type CallbackFunction = (...args: any[]) => void;

Showdown.extension("code-blocks", () => {
	'use strict';
	return [
		{
			type: "lang",
			filter: function(text, converter, options) {
				return text.replace(/```(.*?)\n(.*?)```/gs, (full, one, two) => {
					return `<pre><code class="${one.split(",").join(" ")}">${two.trim()}</code></pre>`
				})
			}
		}
	]
})

class MarkdownPlusCompiler {
	private dir: string = "";
	private listeners: {[key: string]: CallbackFunction[]};
	private converter: Showdown.Converter = new Showdown.Converter({
		extensions: ["math", "footnotes", "code-blocks"],
		customizedHeaderId: true,
		ghCompatibleHeaderId: true,
		simplifiedAutoLink: true,
		strikethrough: true,
		tables: true,
		tasklists: true,
		emoji: true,
		metadata: true,
		moreStyling: true,
		encodeEmails: true,
		ghMentions: true,
		parseImgDimensions: true
	})
	constructor(private config: Config, root: string) {
		// Check if the config file is valid, otherwise the program will throw an error and exit.
		validateConfig(this.config);
		// All paths in the config file are relative to the location of the file so we will just use it's parent directory and redirect from there.
		this.dir = root;
	}

	/**
	 * Adds an event listener to the compiler which will be fired once the event occurs.
	 * Valid events are:
	 *  - change
	 *  - 
	 * @date 7/17/2022 - 8:45:53 AM
	 *
	 * @param {string} event
	 * @param {CallbackFunction} callback
	 */
	public on(event: string, callback: CallbackFunction): void {
		if (!this.listeners.hasOwnProperty(event)) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(callback)
	}

	private readFile(file: string, absolute: boolean = false): string {
		let content = "";
		const exists = (file: string) => fs.existsSync(file) && fs.lstatSync(file).isFile();
		if (absolute) {
			// We received an absolute path, so we can just read the given path.
			if (exists(file)) {
				content = fs.readFileSync(file).toString();
			}
		} else {
			// We received a relative path, we can assume it's inside the dir, so we just join the two paths.
			let p = path.join(this.dir, file);
			if (exists(p)) {
				content = fs.readFileSync(p).toString();
			}
		}

		return content;
	}

	private eval(content: string, env: Environment) {
		const stream = new InputStream(content);
		const tokens = new TokenStream(stream)
		const parsed = parse(tokens);
		evaluate(parsed, env)
		return env;
	}

	public compile(file: string, absolute: boolean = false, env: Environment) {
		const graph = new DependencyGraph();

		let content: string = this.readFile(file, absolute);
		const inlineCode: string[] = [];
		content = content.replace(/\{%(.*?)%\}/gms, (all, code) => {
			env.vars.__writeBuffer = "";
			this.eval(code, env);
			inlineCode.push(code);
			return env.vars.__writeBuffer;
		});

		// For supporting a table of contents we need to get all information about the headings in the document.
		let headingMap = [];
		let headings = content.matchAll(/^(#+) (.*?)(?:\n|$)/gm);
		for (let heading of headings) {
			const level = heading[1].length;
			const text = heading[2];
			const id = text.trim().toLowerCase().replace(/\W/g, "_");
			headingMap.push({ level, text, id });
		}

		env.def("__headings", headingMap);
		this.eval(inlineCode.join(""), env);
		// The environment now contains everything we need to fill the document, we can start replacing inline variables.
		content = content.replace(/\{\{(.*?)\}\}/gm, (all, code) => {
			let value = env.vars[code.trim()];
			if (value === undefined) {
				value = "";
				warn(`Encountered undefined variable: '${code.trim()}'`);
			}
			return value;
		});

		if (this.config.autoResolve) {
			content = this.resolveLinks(content)
		}

		if (this.config.linkValidation) {
			content = this.validateLinks(content, file)
		}

		graph.addNode("current", {})
		const deps = getDependencies(content)
		for (const dep of deps) {
			graph.addNode(dep.name, dep.data)
			graph.addEdge("current", dep.name)
		}
		
		const html = this.converter.makeHtml(content)
		
		const metadata = this.converter.getMetadata(false) as {[key: string]: string}

		return {
			metadata,
			html,
			markdown: content,
			deps: graph.follow("current")
		}
	}

	private findLinkMatch(name: string, files: string[]) {
		// Append all file's names to the list of files.
		let score: number = 0,
			bestMatchPath: string;
		let fileNameList = files
			.map((x) => [x, path.basename(x)])
			.concat(files.map((x) => [x, x]));
		// Loop through all files trying to find the best matching substring
		for (const str of fileNameList) {
			let similarity = stringSimilarity.compareTwoStrings(str[1].toLowerCase(), name.toLowerCase());
			if (similarity > score) {
				bestMatchPath = str[0];
				score = similarity;
			}
		}

		if (score > 0.5) {
			return changeExtension(
				bestMatchPath,
				this.config.compilerOptions.outputHTML ? "html" : "md"
			);
		}
		return null;
	}

	/**
	 * A function to resolve any link following this syntax: "[[<name>]]" by trying to find a file that might correspond to this name.
	 * @date 6/14/2022 - 6:53:17 PM
	 */
	public resolveLinks(content: string) {
		const [files] = this.getFiles();
		return content.replace(RESOLVE_SYNTAX, (all: string, name: string) => {
			let match = this.findLinkMatch(name, files);
			if (match) {
				return `[${name}](${match})`;
			}
			warn(`Could not find target for '${name}', maybe you should be a little more concrete.`);
			return `<a class="no-reference">${name}</a>`;
		})
	}

	private getFiles(extension: string = "") {
		let files = [];
		// Recursively loop through all the files and push their names into the files array
		const recurse = (dir: string, parent: string) => {
			const list = fs.readdirSync(dir);
			for (const file of list) {
				const filePath = path.join(dir, file);
				const relPath = path.join(parent, file);

				const stat = fs.statSync(filePath);
				if (stat.isDirectory()) {
					recurse(filePath, relPath);
				} else if (extension ? relPath.endsWith(extension) : true) {
					files.push(relPath);
				}
			}
		};
		recurse(this.dir, "");
		return [files, files.map((x) => path.join(this.dir, x))];
	}

	public validateLinks(content: string, file: string) {
		return content.replace(
			/<a[^>]*href="([^"]*)"[^>]*>/g,
			(all, link) => {
				if (!link) {
					return all;
				}

				if (
					link.startsWith("http") ||
					link.startsWith("//") ||
					link.startsWith("mailto") ||
					link.startsWith("#") ||
					link.startsWith("/")
				) {
					return all;
				}

				let dirname = path.dirname(
					path.join(this.dir, path.dirname(file), link)
				);

				if (fs.existsSync(dirname)) {
					let dir = fs
						.readdirSync(dirname)
						.map((x) => path.parse(x).name);
					if (dir.includes(path.parse(link).name)) {
						return all;
					}
					warn(
						`Link "${link}" in file "${file}" does not have a valid target.`
					);
					return all.replace(/>$/, ' class="no-reference">');
				} else {
					warn(
						`Link "${link}" in file "${file}" does not have a valid target.`
					);
					return all.replace(/>$/, ' class="no-reference">');
				}
			}
		);
	}
}



export default MarkdownPlusCompiler
export { DependencyGraph } from './dependencies/index.js'
import * as path from "path";
import { warn } from "./console-dispatcher.js";
import { Config, validateConfig } from "./config.js";
import { Environment, evaluate, InputStream, parse, TokenStream } from "@gyro-lang/core";
import { getDependencies } from "./dependencies/index.js";
import { LinkValidator } from "./LinkValidator.js";
const RESOLVE_SYNTAX = /\[\[(.*?)\]\]/g

class MarkdownPlusCompiler {
	private dir: string = "";
	private out: string = "";
	constructor(private config: Config, configPath: string = process.cwd()) {
		// Check if the config file is valid, otherwise the program will throw an error and exit.
		validateConfig(this.config);
		// All paths in the config file are relative to the location of the file so we will just use it's parent directory and redirect from there.
		this.dir = path.join(path.dirname(configPath), config.rootDir);
		this.out = path.join(path.dirname(configPath), config.outDir);
	}

	private eval(content: string, env: Environment) {
		const stream = new InputStream(content);
		const tokens = new TokenStream(stream)
		const parsed = parse(tokens);
		evaluate(parsed, env)
		return env;
	}

	public compile(content: string, file: string, env: Environment = new Environment(null)) {
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

		const deps = getDependencies(content)

		return {
			markdown: content,
			dependencies: deps
		}
	}

	/**
	 * A function to resolve any link following this syntax: "[[<name>]]" by trying to find a file that might correspond to this name.
	 * @date 6/14/2022 - 6:53:17 PM
	 */
	public resolveLinks(content: string) {
		const files = LinkValidator.getAllFiles(this.dir);
		return content.replace(RESOLVE_SYNTAX, (all: string, name: string) => {
			let match = LinkValidator.findMatch(name, files);
			if (match) {
				return `[${name}](${match.replace(this.dir, "")})`;
			}
			warn(`Could not find target for '${name}', maybe you should be a little more concrete.`);
			return `<a class="no-reference">${name}</a>`;
		})
	}
}

export { MarkdownPlusCompiler }
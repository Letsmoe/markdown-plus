#!/usr/bin/env node

import { colarg, COLORS, color } from "colarg";
import * as fs from "fs";
import * as path from "path";
import { shared, testInclude } from "./shared.js";
import { readParseFile } from "./parse-file.js";
import { FileWatcher } from "./file-watcher.js";
import { issueWarning } from "./console-dispatcher.js";
import { checkConfig, Config } from "./config.js";
import * as mime from "mime-types";
import { getDependencies } from "./dependencies.js";

const args = colarg(process.argv.slice(2))
	.options({
		watch: {
			alias: "w",
			type: "boolean",
			desc: "Whether or not to watch the entry file for changes.",
			default: false,
			required: false,
		},
		project: {
			alias: "p",
			type: "string",
			desc: "The project to use for the compilation.",
			default: "",
			required: false,
		},
		markdown: {
			alias: "md",
			type: "boolean",
			desc: "Whether or not to output markdown instead of HTML.",
			default: false,
			required: false,
		},
		output: {
			alias: "o",
			type: "string",
			desc: "The file to output to.",
			default: "",
			required: false,
		}
	})
	.usage("Usage: npx mppc [-p <project>] [-w <true|false>]")
	.help().args;

const pad = (str: any) => {
	return str.toString().padStart(2, "0");
};

const changeExtension = (file: string, ext: string) => {
	return file.substring(0, file.lastIndexOf(".")) + "." + ext;
};

function makeHTML(txt: string, file: string) {
	let outputString = "";
	outputString = shared.converter.makeHtml(txt);
	outputString = shared.config.resultModifier.after(outputString);
	const head = `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="${shared.config.css}">`;
	const metadata = shared.converter.getMetadata(false);
	outputString = shared.config.wrapper(
		head,
		loadHeaderFile(),
		outputString,
		"",
		metadata,
		txt
	);
	if (shared.config.linkValidation) {
		// Check if all links in the file actually have a target, if they begin with http we just assume they exist.
		outputString = outputString.replace(
			/<a[^>]*href="([^"]*)"[^>]*>/g,
			(all, link) => {
				if (!link) {
					return all;
				}

				if (
					link.startsWith("http") ||
					link.startsWith("//") ||
					link.startsWith("mailto") ||
					link.startsWith("#")
				) {
					return all;
				}

				let dirname = path.dirname(
					path.join(shared.ROOT, path.dirname(file), link)
				);

				if (fs.existsSync(dirname)) {
					let dir = fs
						.readdirSync(dirname)
						.map((x) => path.parse(x).name);
					if (dir.includes(path.parse(link).name)) {
						return all;
					}
					issueWarning(
						`Link "${link}" in file "${file}" does not have a valid target.`
					);
					return all.replace(/>$/, ' class="no-reference">');
				} else {
					issueWarning(
						`Link "${link}" in file "${file}" does not have a valid target.`
					);
					return all.replace(/>$/, ' class="no-reference">');
				}
			}
		);
	}
	return outputString;
}

function useProject(config: Config) {
	console.log(`Using project ${args.project}`);

	// Check if the given config follows the required schema. May lead to early exit.
	shared.config = checkConfig(config);
	// All paths in the config file are relative to the location of the file so we will just use it's parent directory and redirect from there.
	shared.ROOT =
		path.join(process.cwd(), path.dirname(args.project), config.rootDir) ||
		path.dirname(args.project);
	process.chdir(shared.ROOT);
	if (config.watch == true || args.watch == true) {
		// Determine whether a FileWatcher should be assigned to the projects root folder.
		new FileWatcher(shared.ROOT, run);
	}
	run();
}

// Check if a project was given, if not check if a default path was given as first argument.
if (args.project) {
	const configPath = path.join(process.cwd(), args.project);

	let configMimeType = mime.lookup(configPath);

	if (configMimeType === "application/json") {
		let rawConfigData = fs.readFileSync(configPath, "utf8");
		if (rawConfigData !== "") {
			const config = JSON.parse(rawConfigData);
			useProject(config);
		} else {
			issueWarning("Project file is empty at: " + configPath);
		}
	} else if (configMimeType === "application/javascript") {
		import(configPath).then(async (config: any) => {
			const configData = config.default;
			useProject(configData);
		});
	}
} else if (args._default[0]) {
	const runSingleFile = () => {
		console.clear();
		let inputFile = args._default[0];
		let outputFile: string;
		
		if (args.output == "") {
			outputFile = path.basename(inputFile) + ".html";
		} else {
			outputFile = path.resolve(process.cwd(), args.output);
		}
		console.log(`Compiling ${inputFile} to ${outputFile}`);

		let content = readParseFile(inputFile, shared.env);
		if (args.markdown === false) {
			let html = makeHTML(content, inputFile);
			fs.writeFileSync(outputFile, html);
		} else {
			fs.writeFileSync(outputFile, content);
		}
	};

	if (args.watch === true) {
		new FileWatcher(shared.ROOT, runSingleFile);
	} else {
		runSingleFile();
	}
}

function getInputFiles() {
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
			} else if (testInclude(relPath) && relPath.endsWith("mpp")) {
				files.push(relPath);
			}
		}
	};
	recurse(shared.ROOT, "");
	return files;
}

function loadHeaderFile() {
	if (shared.config.headerFile) {
		return fs.readFileSync(
			path.join(shared.ROOT, shared.config.headerFile),
			"utf8"
		);
	}
	return "";
}

function run() {
	shared.errors = 0;
	let date = new Date();
	let time = `[${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
		date.getSeconds()
	)}]`;
	let cStart = Date.now();
	console.clear();
	process.stdout.write(
		`${time} File change detected. Starting compilation...\n`
	);

	const files = getInputFiles();
	// Loop through all existing files
	for (const file of files) {
		if (file.endsWith("mppm")) {
			// If the file is a module, we will just continue.
			process.stdout.write("Skipping module: " + file + "\n");
			continue;
		}

		const dependencies = getDependencies(file);
		// Loop through the dependencies array and check if the file exists, if so, copy it to the target directory.
		for (const dependency of dependencies) {
			// Check if the dependency matches the config includeAssets regexp
			const dependencyPath = path.join(shared.ROOT, dependency);
			if (shared.config.checkAssets(dependencyPath)) {
				if (fs.existsSync(dependencyPath)) {
					const targetPath = path.join(
						shared.config.outDir,
						dependency
					);
					const targetDir = path.dirname(targetPath);
					if (!fs.existsSync(targetDir)) {
						fs.mkdirSync(targetDir, { recursive: true });
					}
					fs.copyFileSync(dependencyPath, targetPath);
				}
			}
		}

		let content = {
			md: readParseFile(file, shared.env),
			html: "",
		};
		content.md = shared.config.resultModifier.before(content.md);
		// Now we will generate the HTML if requested.
		if (shared.config.compilerOptions.outputHTML) {
			content.html = makeHTML(content.md, file);
		}
		let newPath = path.join(
			shared.ROOT,
			shared.config.outDir,
			changeExtension(file, "html")
		);
		fs.mkdir(path.dirname(newPath), { recursive: true }, (err: Error) => {
			if (err) throw err;
			fs.writeFileSync(
				newPath,
				shared.config.compilerOptions.outputHTML
					? content.html
					: content.md
			);
		});
	}

	let timeTaken = color(
		`${Math.round(Date.now() - cStart)}ms`,
		COLORS.YELLOW
	);
	process.stdout.write(
		`${time} Found ${shared.errors} errors. Took: ${timeTaken}. Watching for file changes...\n`
	);
}

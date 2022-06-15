import {shared} from "./shared.js"
import * as path from "path";
import * as fs from "fs";
import {issueWarning} from "./console-dispatcher.js";

import {
	InputStream,
	TokenStream,
	parse, evaluate, Environment
} from "@gyro-lang/core";

function parseAndEvaluate(value: string, env: Environment) {
	const stream = new InputStream(value);
	const tokens = new TokenStream(stream)
	const parsed = parse(tokens);
	evaluate(parsed, env)
	return env;
}

function readParseFile(filename: string, env: any) {
	const absPath = path.join(shared.ROOT, filename);
	if (!fs.existsSync(absPath)) {
		issueWarning(`File does not exist at: ${absPath}`);
		return "";
	}
	var content = fs.readFileSync(absPath, "utf8");
	var inlineCode: string[] = [];
	content = content.replace(/\{%(.*?)%\}/gms, (all, code) => {
		env.vars.__writeBuffer = "";
		parseAndEvaluate(code, env);
		inlineCode.push(code);
		return env.vars.__writeBuffer;
	});

	// Collect information about the markdown that is being rendered here to allow for some methods to run properly
	let headingMap = [];
	let headings = content.matchAll(/^(#+) (.*?)(?:\n|$)/gm);
	for (let heading of headings) {
		const level = heading[1].length;
		const text = heading[2];
		const id = text.trim().toLowerCase().replace(/\W/g, "_");
		headingMap.push({ level, text, id });
	}

	env.def("__headings", headingMap);

	parseAndEvaluate(inlineCode.join(""), env);
	const variables = env.vars;
	// env now contains all variables we need to fill the document.
	content = content.replace(/\{\{(.*?)\}\}/gm, (all, code) => {
		let value = variables[code.trim()];
		if (value === undefined) {
			value = "";
			issueWarning(
				`Encountered undefined variable: '${code.trim()}' at ${filename}`
			);
		}
		return value;
	});
	return content;
}

export {readParseFile}
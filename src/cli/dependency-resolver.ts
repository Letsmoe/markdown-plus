import * as fs from 'fs';
import {issueWarning} from "./console-dispatcher.js";
import {shared} from "./shared.js"
import * as path from "path";

type Dependency = { path: string; imports: any[], type: string };

const correctPath = (relPath:string) => {
	if (fs.existsSync(relPath) || relPath.match(/(.+)\.(.+)/)) {
		return relPath;
	}
	relPath += ".mpp";
	return relPath;
}

const getDependencies = (filename: string) => {
	let absPath = path.join(shared.ROOT, filename);
	if (!fs.existsSync(absPath)) {
		issueWarning(`File does not exist at: ${absPath}`);
		return;
	}
	let content = fs.readFileSync(absPath, "utf8");
	let imports: Dependency[] = [];
	Array.from(content.matchAll(/include\("(.*?)"\)/gm)).forEach((match) => {
		let path = correctPath(match[1])
		imports.push({
			path: path,
			imports: getDependencies(path) || [],
			type: "include"
		});
	});
	Array.from(content.matchAll(/(?<!!)\[.*?\]\((?!http|:\/\/)(.*?)\)/gm)).forEach((match) => {
		let path = correctPath(match[1])
		imports.push({
			path: path,
			imports: getDependencies(path) || [],
			type: "link"
		});
	})
	return imports;
};

const flatDeps = (imps: Dependency[]) => {
	return imps.map((x) => [x, ...flatDeps(x.imports)]).flat(Infinity);
};

const objectFromDependencies = (entry: string) => {
	return flatDeps(getDependencies(entry)).map((x : Dependency) => ({path: x.path, type: x.type}))
};

export {objectFromDependencies, Dependency}
import { issueError, issueWarning } from "./console-dispatcher.js";
import { shared } from "./shared.js";

interface Config {
	outDir: string,
	rootDir?: string,
	include?: string[],
	exclude?: string[],
	css?: string,
	watch?: boolean,
	compilerOptions?: {
		outputHTML: boolean,
	},
	headerFile?: string,
	resultModifier: {
		before: (content: string) => string,
		after: (content: string) => string
	},
	generateMetadata: (metadata: any) => string,
	wrapper: (head:string, header:string, body:string, footer:string, metadata: any, source: string) => string,
	checkAssets?: (file: string) => boolean,
	linkValidation: boolean
}

// Create a function that deeply merges two objects
function deepMerge(target: any, source: any) {
	for (let key in source) {
		if (source.hasOwnProperty(key)) {
			if (typeof source[key] === "object") {
				target[key] = deepMerge(target[key], source[key]);
			} else {
				target[key] = source[key];
			}
		}
	}
	return target;
}

function checkConfig(config: Config) {
	config = deepMerge(shared.config, config);

	if (config.outDir == "") {
		issueError("No output directory specified.");
	}
	return config
}

export {checkConfig, Config}
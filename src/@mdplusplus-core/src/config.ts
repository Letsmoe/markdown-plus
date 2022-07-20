import {Config} from "./config.type.js";
import { error, warn } from "./console-dispatcher.js";

const defaultConfig: Config = {
	outDir: "./",
	rootDir: "./",
	exclude: [],
	serve: false,
	serverOptions: {
		port: 8080,
		open: true,
	},
	watch: false,
	linkValidation: true,
	autoResolve: true,
	playgrounds: [{
		match: ["js", "javascript"],
		use: "mdp-js-playground"
	}],
	backend: "@mdplusplus/html-backend",
	preprocessors: [],
	environment: "__default"
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

function validateConfig(config: Config) {
	config = deepMerge(defaultConfig, config);

	if (config.outDir == "") {
		error("No output directory specified.");
	}
	return config;
}

export { validateConfig, Config, defaultConfig };

import { Config } from "./types/config.type.js";
import { Preprocessor } from "./types/preprocessors.type.js";

/**
 * A helper function that loads all preprocessors, defined inside a passed config, and returns them in order of execution.
 * @date 7/22/2022 - 5:18:06 PM
 *
 * @async
 * @param {Config} config
 * @returns {Promise<any>}
 */
async function loadPreprocessors(config: Config, out: string): Promise<any> {
	const object = {};
	const loaders = await Promise.all(config.preprocessors.map(async (x: Preprocessor | string) => {
		return new Promise((resolve) => {
			let after = null, options = {}, name: string;
			if (typeof x === "string") {
				name = x
			} else {
				name = x.use;
				after = x.after
				options = x.options
			}
			import(name).then((module) => {
				object[name] = {name, after, options, use: module.default(options, out)};
				resolve(name)
			}).catch(e => {
				console.error("Error loading preprocessor, '" + name + "' does not exist.");
				process.exit(1);
			});
		});
	})) as string[];

	const arr = [];
	const indexMap = {}
	loaders.forEach(name => {
		const loader = object[name];
		if (loader.after) {
			let index = indexMap[loader.after] || arr.length;
			arr.splice(index, 0, loader.use)
		} else {
			arr.unshift(loader.use)
		}
	})

	return arr;
}

export { loadPreprocessors }
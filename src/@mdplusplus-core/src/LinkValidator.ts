import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
import stringSimilarity from "string-similarity";

interface ValidationConfig {
	timeout?: number;
	validateOnline?: boolean;
	ignoreExtensions?: string[];
	targetDir?: string;
	onlyFile?: boolean;
}

const defaultValidationConfig = {
	validateOnline: true,
	ignoreExtensions: [],
	targetDir: process.cwd(),
	timeout: 500,
	onlyFile: true,
};

class LinkValidator {
	private config: ValidationConfig;
	constructor(config: ValidationConfig = {}) {
		this.config = Object.assign(defaultValidationConfig, config);
	}

	public static isOnline(link: string): boolean {
		if (link.startsWith("http") || link.startsWith("//")) {
			return true;
		}
		return false;
	}

	public static isFile(link: string, onlyFile: boolean = false): boolean {
		return (
			fs.existsSync(link) &&
			(onlyFile ? fs.lstatSync(link).isFile() : true)
		);
	}

	public static getAllFiles(folder: string, depth: number = Infinity, curr: number = 0): [string, string][] {
		let final = [];
		if (depth > curr) {
			let files: string[] = fs.readdirSync(folder);
			for (const file of files) {
				let newPath = path.join(folder, file);
				if (fs.lstatSync(newPath).isFile()) {
					final.push([newPath, path.basename(newPath)]);
				} else if (fs.lstatSync(newPath).isDirectory()) {
					final = final.concat(LinkValidator.getAllFiles(newPath, depth, curr + 1));
				}
			}
		}
		return final
	}

	public static findMatch(
		name: string,
		files: [string, string][]
	): string | null {
		// Append all file's names to the list of files.
		let score: number = 0,
			bestMatchPath: string;
		// Loop through all files trying to find the best matching substring
		for (const [abs, rel] of files) {
			let similarity = stringSimilarity.compareTwoStrings(
				rel.toLowerCase(),
				name.toLowerCase()
			);
			if (similarity > score) {
				bestMatchPath = abs;
				score = similarity;
			}
		}

		if (score > 0.5) {
			return bestMatchPath;
		}
		return null;
	}

	public static async validate(
		link: string,
		config: ValidationConfig = defaultValidationConfig
	): Promise<boolean> {
		config = Object.assign(defaultValidationConfig, config);

		return new Promise(async (resolve) => {
			/**
			 * Check if the given link points to an online source, if it does we need to check the response code only if the config options "validateOnline" is enabled.
			 */

			if (LinkValidator.isOnline(link)) {
				if (config.validateOnline) {
					const controller = new AbortController();
					const signal = controller.signal;
					try {
						const response = await fetch(link, { signal });
						setTimeout(() => {
							controller.abort();
						}, config.timeout);
						resolve(response.status == 200);
					} catch (error) {
						resolve(false);
					}
				} else {
					resolve(true);
				}
			} else {
				/**
				 * We found an offline link, check the directory if the file exists.
				 * It might be an absolute path, check that first.
				 */
				if (LinkValidator.isFile(link, config.onlyFile)) {
					resolve(true);
				}
				// The path was not absolute, check if it is relative.
				let full = path.join(config.targetDir, link);
				if (LinkValidator.isFile(full, config.onlyFile)) {
					resolve(true);
				}
				resolve(false);
			}
		});
	}

	public async validate(link: string): Promise<boolean> {
		return await LinkValidator.validate(link, this.config);
	}
}

export { LinkValidator };

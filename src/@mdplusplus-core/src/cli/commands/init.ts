import * as path from 'path';
import * as fs from 'fs';
import { warn } from '../../console-dispatcher.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function checkCreate(path: string, content: string = "") {
	if (!fs.existsSync(path)) {
		if (!content) {
			fs.mkdirSync(path, { recursive: true });
		} else {
			fs.writeFileSync(path, content)
		}
	}
}

function logObject(object: any, level: number = 0) {
	let keys = Object.keys(object).length
	let i = 0;
	for (const key in object) {
		let text = "    ".repeat(Math.max(0, level - 1))
		level ? text += (i != keys - 1 ? "├──" : "└──") : null;
		text += (level ? " " : "") + key
		console.log(text);
		let value = object[key];
		i++;

		if (typeof value === "object") {
			logObject(value, level + 1);
		}
	}
}

function replaceVars(content: string, vars: {[key: string]: number | string}): string {
	return content.replace(/(?<!\{)\{([A-z0-9]+)\}(?!\})/g, (full, name) => {
		return (vars[name.trim()] || "").toString();
	})
}

export default function initCommand(args: {[key: string]: any}) {
	let root = (args.default && args.default.length > 0) ? path.join(process.cwd(), args.default[0]) : process.cwd();
	let docs = path.join(root, 'docs')
	let includes = path.join(__dirname, '../../../includes/')

	if (!fs.existsSync(docs) || args.force) {
		checkCreate(docs)
		checkCreate(path.join(docs, "out"))
		checkCreate(path.join(docs, "src"))
		checkCreate(path.join(docs, "out", "scripts"))
		checkCreate(path.join(docs, "out", "style"))
		checkCreate(path.join(docs, "out", "assets"))

		let vars = {
			title: args.title || ":title",
			author: args.author || ":author"
		}
		let summary = replaceVars(fs.readFileSync(path.join(includes, "summary.txt")).toString(), vars)
		let index = replaceVars(fs.readFileSync(path.join(includes, "index.txt")).toString(), vars)
		let config = fs.readFileSync(path.join(includes, "config.txt")).toString()
		let style = fs.readFileSync(path.join(includes, "style.css")).toString();

		checkCreate(path.join(docs, "out", "style", "main.css"), style)
		checkCreate(path.join(docs, "src", "SUMMARY.mpp"), summary)
		checkCreate(path.join(docs, "src", "index.mpp"), index)
		checkCreate(path.join(docs, "mdp.config.json"), config)

		console.log("Successfully initialized project, the directory structure now looks like this:")
		logObject({
			"/": {
				"docs": {
					"mdp.config.json": "",
					"out": {
						"scripts": {},
						"style": {},
						"assets": {}
					},
					"src": {
						"index.mpp": "",
						"SUMMARY.mpp": ""
					}
				}
			}
		})
	} else {
		warn("The docs directory already exists, are you sure you want to overwrite it? Use the --force flag to do so.")
	}

	process.exit(0);
}
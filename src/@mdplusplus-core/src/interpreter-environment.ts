import { readParseFile } from './parse-file.js';
import {shared} from './shared.js';
import { Environment } from "@gyro-lang/core";

const env = new Environment(null);

env.def("print", (...args: any[]) => {
	process.stdout.write(args.join(" ") + "\n");
});

env.def("setDefaultCSS", (path: string) => {
	shared.config.css = path;
});

env.def("include", (filename: string) => {
	const content = readParseFile(filename, env);
	return content;
});

env.def("center", (...args: any[]) => {
	const content = `<p align="center">${args.join("<br>")}</p>`;
	env.vars.__writeBuffer += content;
	return content;
})

env.def("__headings", []);

env.def("toc", (title: string) => {
	let list = "<ol>";
	let inLevel3 = false;
	env.vars.__headings.forEach(
		(heading: { level: number; id: string; text: string }) => {
			let link = `<li><a href="#${heading.id}">${heading.text}</a></li>`;
			if (heading.level == 3) {
				if (inLevel3) {
					list += link;
					return;
				}
				inLevel3 = true;
				list += `<ul>${link}`;
			} else if (heading.level == 2) {
				if (inLevel3) {
					list += "</ul>";
				}
				list += link;
				inLevel3 = false;
			}
		}
	);
	list += "</ol>";
	return `<details><summary>${title}</summary>${list}</details>`;
});

env.def("write", (...args: any[]) => {
	env.vars.__writeBuffer += args.join(" ");
	return args.join(" ")
})

export {env}
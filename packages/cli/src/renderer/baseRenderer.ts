import * as fs from 'fs';
import * as path from 'path';
import __dirname from "../__dirname.js";

export default function(options: any, out: string) {
	/**
	 * We want to create some default directories.
	 * First create a style and a scripts folder.
	 */
	const dirStyle = path.join(out, "style");
	const dirScript = path.join(out, "scripts");

	if (!fs.existsSync(dirStyle)) {
		fs.mkdirSync(dirStyle);
	}
	if (!fs.existsSync(dirScript)) {
		fs.mkdirSync(dirScript);
	}

	/**
	 * Move the main style into the style folder.
	 */
	fs.copyFileSync(path.join(__dirname, "../includes/style.css"), path.join(dirStyle, "style.css"))


	return function(content: string, summary: string) {
		const head = `<head>
			<link rel="stylesheet" href="/style/style.css">
			<script type="module">
				import summary from "/scripts/summary.js";
				document.querySelector(".sidebar").innerHTML = summary;
			</script>
		</head>`
		const body = `<body>
			<div class="sidebar"></div>
			<div class="inner-body">${content}</div>
		</body>`
		return `<!DOCTYPE html><html>${head}${body}</html>`;
	}
}
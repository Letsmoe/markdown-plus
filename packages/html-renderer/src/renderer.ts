import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface Options {}

export default function renderer(
	options: Options,
	outFolder: string
) {
	const scripts = path.join(outFolder, "scripts");
	if (!fs.existsSync(scripts)) {
		fs.mkdirSync(scripts);
	}
	const styles = path.join(outFolder, "style");
	if (!fs.existsSync(styles)) {
		fs.mkdirSync(styles);
	}
	// Move the default style into the style folder.
	fs.copyFileSync(path.join(__dirname, "../style/main.css"), path.join(styles, "main.css"));
	// Move the content script into the scripts folder.
	fs.copyFileSync(path.join(__dirname, "../dist/index.prod.js"), path.join(scripts, "index.js"));

	return function (content: string, metadata: any, config: any) {
		fs.writeFileSync(path.join(scripts, "config.json"), JSON.stringify(config));
		// The title is important, it should always be present.
		const meta = [`<title>${metadata["title"] || ""} | ${config["title"] || "Documentation"}</title>`];
		for (const key in metadata) {
			const value = metadata[key];
			if (key == "styles") {
				value.map(x => meta.push(`<link rel="stylesheet" href="${x}" />`));
			} else {
				meta.push(`<meta name="${key}" content="${value}"></meta>`)
			}
		}

		const head = `<head><link rel="stylesheet" href="/style/main.css">${meta.join("")}</head>`;
		const body = `<body><div class="markdown-body">${content}</div><script src="/scripts/index.js"></></body>`;

		return `<!DOCTYPE html><html>${head}${body}</html>`
	};
}

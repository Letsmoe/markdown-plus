import * as showdown from "showdown";
import { Environment } from "@gyro-lang/core";
import { Config } from "./config.js";
import { env } from "./interpreter-environment.js";
import * as mime from "mime-types";
//@ts-ignore
import * as mathjax from "mathjax";

// Create a function that loops through the include conditions in shared.config and test whether the given regex matches the file name
const testInclude = (file: string) => {
	for (const req of shared.config.include) {
		let reg = new RegExp(req);
		if (reg.test(file)) {
			return true;
		}
	}
	return false;
};

mathjax
	.init({
		loader: { load: ["input/tex", "output/svg"] },
	})
	.then((mj: any) => {
		shared.mj = mj;
	})
	.catch(() => console.log("Could not load MathJax..."));

const mathExtension = () => {
	return [
		{
			type: "lang",
			regex: /^¨D¨D(.*?)¨D¨D$/gms,
			replace: (match: string, content: string) => {
				const svg = shared.mj.tex2svg(content, { display: true });
				return shared.mj.startup.adaptor.outerHTML(svg);
			},
		},
	];
};

const footnotesExtension = () => [
	{
		type: "lang",
		filter: (text: string) =>
			text.replace(
				/^\[\^([\d\w]+)\]:\s*((\n+(\s{2,4}|\t).+)+)$/gm,
				(str, name, rawContent, _, padding) => {
					const content = shared.converter.makeHtml(
						rawContent.replace(new RegExp(`^${padding}`, "gm"), "")
					);
					return `<div class="footnote" id="footnote-${name}"><a href="#footnote-${name}"><sup>[${name}]</sup></a>:${content}</div>`;
				}
			),
	},
	{
		type: "lang",
		filter: (text: string) =>
			text.replace(
				/^\[\^([\d\w]+)\]:( |\n)((.+\n)*.+)$/gm,
				(str, name, _, content) =>
					`<small class="footnote" id="footnote-${name}"><a href="#footnote-${name}"><sup>[${name}]</sup></a>: ${content}</small>`
			),
	},
	{
		type: "lang",
		filter: (text: string) =>
			text.replace(
				/\[\^([\d\w]+)\]/m,
				(str, name) =>
					`<a href="#footnote-${name}"><sup>[${name}]</sup></a>`
			),
	},
];

// @ts-ignore
showdown.default.extension("footnotes", footnotesExtension);
// @ts-ignore
showdown.default.extension("math", mathExtension);

const shared: {
	config: Config;
	ROOT: string;
	errors: number;
	warnings: number;
	converter: showdown.Converter;
	env: Environment;
	mj: any;
} = {
	mj: undefined,
	ROOT: "",
	errors: 0,
	warnings: 0,
	// @ts-ignore
	converter: new showdown.default.Converter({
		extensions: ["math", "footnotes"],
		customizedHeaderId: true,
		ghCompatibleHeaderId: true,
		simplifiedAutoLink: true,
		strikethrough: true,
		tables: true,
		tasklists: true,
		emoji: true,
		metadata: true,
		moreStyling: true,
	}),
	env: env,
	config: {
		outDir: "",
		rootDir: "",
		watch: false,
		include: [".*"],
		exclude: [],
		css: "",
		compilerOptions: {
			outputHTML: true,
		},
		headerFile: "",
		resultModifier: {
			before: (x) => x,
			after: (x) => x,
		},
		checkAssets: (x) => {
			let type = mime.lookup(x);
			if (type) {
				if (
					[
						"image/png",
						"image/jpeg",
						"image/gif",
						"image/svg+xml",
					].includes(type)
				) {
					return true;
				}
			}
		},
		generateMetadata(metadata : any) {
			let str = "";
			for (const key in metadata) {
				let value = metadata[key];
				if (key === "title") {
					str += `<title>${value}</title>`;
				} else if (key === "description") {
					str += `<meta name="description" content="${value}">`;
				} else if (key === "keywords") {
					str += `<meta name="keywords" content="${value}">`;
				} else if (key === "author") {
					str += `<meta name="author" content="${value}">`;
				} else if (key === "date") {
					str += `<meta name="date" content="${value}">`;
				} else if (key === "copyright") {
					str += `<meta name="copyright" content="${value}">`;
				} else if (key === "scripts") {
					for (const script of value) {
						str += `<script src="${script}"></script>`;
					}
				} else if (key === "styles") {
					for (const style of value) {
						str += `<link rel="stylesheet" href="${style}">`;
					}
				}
			}
			return str;
		},
		linkValidation: true,
		wrapper: function(
			head: string,
			header: string,
			body: string,
			footer: string,
			metadata: any,
			source: string
		) {
			let str = `<!DOCTYPE html><html><head>${head}${this.generateMetadata(metadata)}</head><body>${header}${body}</body>${footer}</html>`;
			return str;
		},
	},
};

export { shared, testInclude };

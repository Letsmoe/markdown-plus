import Showdown from "showdown";
import { Environment } from "@gyro-lang/core";
import { Config } from "./config.js";
import { env } from "./interpreter-environment.js";
import * as mime from "mime-types";
//@ts-ignore
import * as mathjax from "mathjax";

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

Showdown.extension("footnotes", footnotesExtension);
Showdown.extension("math", mathExtension);

const defaultConfig = {
	outDir: "",
	rootDir: "",
	watch: false,
	include: [".*"],
	exclude: [],
	css: [],
	compilerOptions: {
		outputHTML: true,
	},
	serve: true,
	serverOptions: {
		port: 8080,
		host: "localhost",
		open: true,
	},
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
		
	},
	linkValidation: true,
	wrapper: function(
		head: string,
		body: string,
		metadata: any,
		source: string
	) {
		let str = `<!DOCTYPE html><html><head>${head}${this.generateMetadata(metadata)}</head><body>${body}</body></html>`;
		return str;
	},
};

const shared: {
	env: Environment;
	scripts: {[key: string]: string}
} = {
	env: env,
	scripts: {}
};

export { shared };

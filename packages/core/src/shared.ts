import { Environment } from "@gyro-lang/core";
import Showdown from "showdown";

const converter = new (require('showdown').Converter)()

const footnotesExtension = () => [
	{
		type: "lang",
		filter: (text: string) =>
			text.replace(
				/^\[\^([\d\w]+)\]:\s*((\n+(\s{2,4}|\t).+)+)$/gm,
				(str, name, rawContent, _, padding) => {
					const content = converter.makeHtml(
						rawContent.replace(new RegExp(`^${padding}`, "gm"), "")
					);
					return `<div class="footnote" id="footnote-${name}"><a href="#footnote-${name}"><sup>[${name}]</sup></a>${content}</div>`;
				}
			),
	},
	{
		type: "lang",
		filter: (text: string) =>
			text.replace(
				/^\[\^([\d\w]+)\]:( |\n)((.+\n)*.+)$/gm,
				(str, name, _, content) =>
					`<small class="footnote" id="footnote-${name}"><a href="#footnote-${name}"><sup>[${name}]</sup></a>${content}</small>`
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

import createEnvironment from "./environments/__default.js";

const shared: {
	scripts: {[key: string]: string};
	env: Environment
} = {
	scripts: {},
	env: createEnvironment()
};

export { shared };

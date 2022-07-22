/**
 * Copyright (c) Continuum-AI Inc. and its affiliates.
 *
 * This source code is license under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @author Letsmoe
 * @email moritz.utcke@gmx.de
 * @desc
 */

import { ASTWalker } from "../index.js";

export default function(options: string) {
	const walker = new ASTWalker();
	walker.on("paragraph", (content: string[]) => {
		return `<p>${content.join("")}</p>`;
	});
	walker.on("text", (content: string[], node: any) => {
		return node.text
	})
	walker.on("Program", (content: string[]) => {
		return content.join("");
	})
	walker.on("space", () => {
		return "";
	})
	walker.on("html", (content: string[], node: any) => {
		return node.text
	})
	walker.on("heading", (content: string[], node: any) => {
		return `<h${node.depth}>${content.join("")}</h${node.depth}>`
	})
	walker.on("codespan", (content: string[], node: any) => {
		return `<code>${node.text}</code>`
	})
	walker.on("blockquote", (content: string[], node: any) => {
		return `<blockquote>${content.join("")}</blockquote>`
	})
	walker.on("code", (content: string[], node: any) => {
		return `<pre><code>${node.raw}</code></pre>`
	})

	return function(ast: any) {
		console.log(ast);
		
		return walker.traverse({
			tokens: ast,
			type: "Program"
		});
	}
}
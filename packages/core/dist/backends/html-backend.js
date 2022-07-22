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
export default function (options) {
    const walker = new ASTWalker();
    walker.on("paragraph", (content) => {
        return `<p>${content.join("")}</p>`;
    });
    walker.on("text", (content, node) => {
        return node.text;
    });
    walker.on("Program", (content) => {
        return content.join("");
    });
    walker.on("space", () => {
        return "";
    });
    walker.on("html", (content, node) => {
        return node.text;
    });
    walker.on("heading", (content, node) => {
        return `<h${node.depth}>${content.join("")}</h${node.depth}>`;
    });
    walker.on("codespan", (content, node) => {
        return `<code>${node.text}</code>`;
    });
    walker.on("blockquote", (content, node) => {
        return `<blockquote>${content.join("")}</blockquote>`;
    });
    walker.on("code", (content, node) => {
        return `<pre><code>${node.raw}</code></pre>`;
    });
    return function (ast) {
        console.log(ast);
        return walker.traverse({
            tokens: ast,
            type: "Program"
        });
    };
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Environment } from "@gyro-lang/core";
import { defaultConfig } from "./config.js";
import { MarkdownPlusCompiler, loadPreprocessors, loadBackend } from "./index.js";
import { marked } from "marked";
let compiler = new MarkdownPlusCompiler(defaultConfig);
(() => __awaiter(void 0, void 0, void 0, function* () {
    const content = `
Auto Resolving
---------------

[[__default.js]]

Code Blocks
---------------

\`\`\`
console.log("Hey There!");
\`\`\`

## \`Footnotes\`

Here is a simple footnote[^1].

A footnote can also have multiple lines[^2].  

You can also use words, to fit your writing style more closely[^note].

[^1]: My reference.
[^2]: 
	Every new line should be prefixed with 2 spaces.  
	This allows you to have a footnote with multiple lines.
[^note]: 
	Named footnotes will still render with numbers instead of the text but allow easier identification and linking.  
    This footnote also has been made with a different syntax using 4 spaces for new lines.

`;
    const backend = yield loadBackend(defaultConfig);
    let preprocessors = yield loadPreprocessors(defaultConfig);
    let processedContent = content;
    for (let i = 0; i < preprocessors.length; i++) {
        const preprocessor = preprocessors[i];
        processedContent = preprocessor(processedContent);
    }
    const { markdown, dependencies } = compiler.compile(processedContent, "", new Environment(null));
    backend(marked.lexer(markdown));
}))();

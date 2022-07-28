import { warn } from "./console-dispatcher.js";
import { evaluate, InputStream, parse, TokenStream } from "@gyro-lang/core";
import { getDependencies } from "./dependencies/index.js";
import { LinkValidator } from "./LinkValidator.js";
const RESOLVE_SYNTAX = /\[\[(.*?)(?:(?=|)\|(.*?)|)\]\]/g;
import createEnvironment from "./environments/__default.js";
const globalEnvironment = createEnvironment();
class MarkdownPlusCompiler {
    constructor(dir = process.cwd()) {
        this.dir = dir;
    }
    eval(content, env) {
        const stream = new InputStream(content);
        const tokens = new TokenStream(stream);
        const parsed = parse(tokens);
        evaluate(parsed, env);
        return env;
    }
    compile(content, env = globalEnvironment) {
        const inlineCode = [];
        content = content.replace(/\{%(.*?)%\}/gms, (all, code) => {
            env.vars.__writeBuffer = "";
            this.eval(code, env);
            inlineCode.push(code);
            return env.vars.__writeBuffer;
        });
        // For supporting a table of contents we need to get all information about the headings in the document.
        let headingMap = [];
        let headings = content.matchAll(/^(#+) (.*?)(?:\n|$)/gm);
        for (let heading of headings) {
            const level = heading[1].length;
            const text = heading[2];
            const id = text.trim().toLowerCase().replace(/\W/g, "_");
            headingMap.push({ level, text, id });
        }
        env.def("__headings", headingMap);
        this.eval(inlineCode.join(""), env);
        // The environment now contains everything we need to fill the document, we can start replacing inline variables.
        content = content.replace(/\{\{(.*?)\}\}/gm, (all, code) => {
            let value = env.vars[code.trim()];
            if (value === undefined) {
                value = "";
                warn(`Encountered undefined variable: '${code.trim()}'`);
            }
            return value;
        });
        content = this.resolveLinks(content);
        const deps = getDependencies(content);
        return {
            markdown: content,
            dependencies: deps
        };
    }
    /**
     * A function to resolve any link following this syntax: "[[<name>]]" by trying to find a file that might correspond to this name.
     * @date 6/14/2022 - 6:53:17 PM
     */
    resolveLinks(content) {
        const files = LinkValidator.getAllFiles(this.dir);
        return content.replace(RESOLVE_SYNTAX, (all, name, optTitle) => {
            let match = LinkValidator.findMatch(name, files, this.dir);
            if (match) {
                return `[${optTitle || name}](${match.replace(this.dir, "")})`;
            }
            return `<a class="no-reference">${optTitle || name}</a>`;
        });
    }
}
export { MarkdownPlusCompiler };

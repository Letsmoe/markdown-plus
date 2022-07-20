#!/usr/bin/env node
/**
 * We want to add some extra flavour to markdown files.
 *
 * Meaning when we edit we don't always want to resolve files, we can construct
 * a list of all files that we have to resolve a specific name from.
 *
 * Imagine this input: !`false` There might be a file somewhere called
 * "false.mpp" inside the "datatypes" directory.
 *
 * We search the source directory to construct this list on each compilation run
 * and replace this kind of syntax with proper markdown links.
 */
import * as fs from "fs";
import * as path from "path";
import { warn } from "./console-dispatcher.js";
import { validateConfig } from "./config.js";
import Showdown from "showdown";
import { evaluate, InputStream, parse, TokenStream } from "@gyro-lang/core";
import { getDependencies } from "./dependencies/index.js";
import { marked } from 'marked';
import { LinkValidator } from "./LinkValidator.js";
const RESOLVE_SYNTAX = /\[\[(.*?)\]\]/g;
const changeExtension = (file, ext) => {
    return file.substring(0, file.lastIndexOf(".")) + "." + ext;
};
Showdown.extension("code-blocks", () => {
    'use strict';
    return [
        {
            type: "lang",
            filter: function (text, converter, options) {
                return text.replace(/```(.*?)\n(.*?)```/gs, (full, one, two) => {
                    return `<pre><code class="${one.split(",").join(" ")}">${two.trim()}</code></pre>`;
                });
            }
        }
    ];
});
class MarkdownPlusCompiler {
    constructor(config, configPath = process.cwd()) {
        this.config = config;
        this.dir = "";
        this.out = "";
        // Check if the config file is valid, otherwise the program will throw an error and exit.
        validateConfig(this.config);
        // All paths in the config file are relative to the location of the file so we will just use it's parent directory and redirect from there.
        this.dir = path.join(path.dirname(configPath), config.rootDir);
        this.out = path.join(path.dirname(configPath), config.outDir);
        // We need to find a suitable backend.
        if (typeof config.backend == "string") {
            import(config.backend).then(module => {
                this.backend = module.default({});
                this.ready();
            });
        }
        else {
            import(config.backend.use).then(module => {
                this.backend = module.default(config.backend.options);
                this.ready();
            });
        }
    }
    ready() { }
    eval(content, env) {
        const stream = new InputStream(content);
        const tokens = new TokenStream(stream);
        const parsed = parse(tokens);
        evaluate(parsed, env);
        return env;
    }
    compile(content, file, env) {
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
        if (this.config.autoResolve) {
            content = this.resolveLinks(content);
        }
        const deps = getDependencies(content);
        const lexedOutput = marked.lexer(content);
        var html = marked.parse(content);
        //var output = this.backend.getOutput(lexedOutput);
        //var metadata = this.backend.getMetadata(lexedOutput);
        if (this.config.linkValidation) {
            html = this.validateLinks(html, file);
        }
        return {
            metadata: {},
            html,
            markdown: content,
            deps: deps
        };
    }
    /**
     * A function to resolve any link following this syntax: "[[<name>]]" by trying to find a file that might correspond to this name.
     * @date 6/14/2022 - 6:53:17 PM
     */
    resolveLinks(content) {
        const files = LinkValidator.getAllFiles(this.dir);
        return content.replace(RESOLVE_SYNTAX, (all, name) => {
            let match = LinkValidator.findMatch(name, files);
            if (match) {
                return `[${name}](${match})`;
            }
            warn(`Could not find target for '${name}', maybe you should be a little more concrete.`);
            return `<a class="no-reference">${name}</a>`;
        });
    }
    static getAllLinks(content, inline = false) {
        /**
         * The content will be given in Markdown, we want to return all links inside the Markdown file.
         */
        let links = [];
        Array.from(content.matchAll(/!?\[.+\]\((.+)\)/gm)).forEach(([full, link]) => {
            links.push(link);
        });
        if (inline) {
            // If we also want to match inline links, we only need to match those that point to online sources.
            Array.from(content.matchAll(/[a-z]+:\/\/[[A-Za-z0-9_.\-~?&=%]+/gm)).forEach(([link]) => {
                links.push(link);
            });
        }
        return links;
    }
    validateLinks(content, file) {
        return content.replace(/<a[^>]*href="([^"]*)"[^>]*>/g, (all, link) => {
            if (!link) {
                return all;
            }
            if (link.startsWith("http") ||
                link.startsWith("//") ||
                link.startsWith("mailto") ||
                link.startsWith("#") ||
                link.startsWith("/")) {
                return all;
            }
            let target = path.join(this.out, (path.dirname(file) + "/").replace(this.dir, ""), link);
            if (!fs.existsSync(target)) {
                warn(`Link "${link}" in file "${file}" does not have a valid target.`);
                return `<a class="no-reference">`;
            }
            return all;
        });
    }
}
export default MarkdownPlusCompiler;
export { LinkValidator } from "./LinkValidator.js";
export { DependencyGraph } from './dependencies/index.js';

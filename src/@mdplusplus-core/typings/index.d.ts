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
import { Config } from "./config.js";
import { Environment } from "@gyro-lang/core";
declare class MarkdownPlusCompiler {
    private config;
    private dir;
    private out;
    private backend;
    constructor(config: Config, configPath?: string);
    ready(): void;
    private eval;
    compile(content: string, file: string, env: Environment): {
        metadata: {};
        html: string;
        markdown: string;
        deps: import("./dependencies/dependencies.type.js").Dependency[];
    };
    /**
     * A function to resolve any link following this syntax: "[[<name>]]" by trying to find a file that might correspond to this name.
     * @date 6/14/2022 - 6:53:17 PM
     */
    resolveLinks(content: string): string;
    static getAllLinks(content: string, inline?: boolean): string[];
    validateLinks(content: string, file: string): string;
}
export default MarkdownPlusCompiler;
export { LinkValidator } from "./LinkValidator.js";
export { DependencyGraph } from './dependencies/index.js';
export { Backend, Config, Preprocessor } from "./config.type.js";

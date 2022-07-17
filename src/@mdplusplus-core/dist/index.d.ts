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
declare type CallbackFunction = (...args: any[]) => void;
declare class MarkdownPlusCompiler {
    private config;
    private dir;
    private listeners;
    private converter;
    constructor(config: Config, root: string);
    /**
     * Adds an event listener to the compiler which will be fired once the event occurs.
     * Valid events are:
     *  - change
     *  -
     * @date 7/17/2022 - 8:45:53 AM
     *
     * @param {string} event
     * @param {CallbackFunction} callback
     */
    on(event: string, callback: CallbackFunction): void;
    private readFile;
    private eval;
    compile(file: string, absolute: boolean, env: Environment): {
        metadata: {
            [key: string]: string;
        };
        html: string;
        markdown: string;
        deps: any[];
    };
    private findLinkMatch;
    /**
     * A function to resolve any link following this syntax: "[[<name>]]" by trying to find a file that might correspond to this name.
     * @date 6/14/2022 - 6:53:17 PM
     */
    resolveLinks(content: string): string;
    private getFiles;
    validateLinks(content: string, file: string): string;
}
export default MarkdownPlusCompiler;
export { DependencyGraph } from './dependencies/index.js';

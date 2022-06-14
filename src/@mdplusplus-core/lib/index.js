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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { colarg } from "colarg";
import * as fs from "fs";
import * as stringSimilarity from "string-similarity";
import * as path from "path";
import { shared, testInclude } from "./shared.js";
import { readParseFile } from "./parse-file.js";
import { FileWatcher } from "./file-watcher.js";
import { issueWarning } from "./console-dispatcher.js";
import { checkConfig } from "./config.js";
import * as mime from "mime-types";
import { getDependencies } from "./dependencies.js";
import Graph from "digraphe";
const parser = new colarg(process.argv.slice(2));
parser.addOption({
    name: "watch",
    alias: "w",
    description: "Watch the project for changes and automatically reload.",
    type: "boolean",
    defaults: false,
    required: false,
});
parser.addOption({
    name: "project",
    alias: "p",
    description: "A project file to use instead of using default settings.",
    type: "string",
    defaults: "",
    required: false,
});
parser.addOption({
    name: "markdown",
    alias: "m",
    description: "Whether or not to output markdown instead of HTML.",
    type: "boolean",
    defaults: false,
    required: false,
});
parser.addOption({
    name: "output",
    alias: "o",
    description: "The output file to write to.",
    type: "string",
    defaults: "",
    required: false,
});
parser.defineUsage("Usage: npx mppc [-p <project>] [-w <true|false>]");
parser.enableHelp();
const args = parser.getArgs();
const pad = (str) => {
    return str.toString().padStart(2, "0");
};
const changeExtension = (file, ext) => {
    return file.substring(0, file.lastIndexOf(".")) + "." + ext;
};
function makeHTML(txt, file) {
    let outputString = "";
    outputString = shared.converter.makeHtml(txt);
    outputString = shared.config.resultModifier.after(outputString);
    const head = `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="${shared.config.css}">`;
    const metadata = shared.converter.getMetadata(false);
    outputString = shared.config.wrapper(head, loadHeaderFile(), outputString, "", metadata, txt);
    if (shared.config.linkValidation) {
        // Check if all links in the file actually have a target, if they begin with http we just assume they exist.
        outputString = outputString.replace(/<a[^>]*href="([^"]*)"[^>]*>/g, (all, link) => {
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
            let dirname = path.dirname(path.join(shared.ROOT, path.dirname(file), link));
            if (fs.existsSync(dirname)) {
                let dir = fs
                    .readdirSync(dirname)
                    .map((x) => path.parse(x).name);
                if (dir.includes(path.parse(link).name)) {
                    return all;
                }
                issueWarning(`Link "${link}" in file "${file}" does not have a valid target.`);
                return all.replace(/>$/, ' class="no-reference">');
            }
            else {
                issueWarning(`Link "${link}" in file "${file}" does not have a valid target.`);
                return all.replace(/>$/, ' class="no-reference">');
            }
        });
    }
    return outputString;
}
function useProject(config) {
    console.log(`Using project ${args.project}`);
    // Check if the given config follows the required schema. May lead to early exit.
    shared.config = checkConfig(config);
    // All paths in the config file are relative to the location of the file so we will just use it's parent directory and redirect from there.
    shared.ROOT =
        path.join(process.cwd(), path.dirname(args.project), config.rootDir) ||
            path.dirname(args.project);
    process.chdir(shared.ROOT);
    if (config.watch == true || args.watch == true) {
        // Determine whether a FileWatcher should be assigned to the projects root folder.
        new FileWatcher(shared.ROOT, run);
    }
    run();
}
// Check if a project was given, if not check if a default path was given as first argument.
if (args.project) {
    const configPath = path.join(process.cwd(), args.project);
    let configMimeType = mime.lookup(configPath);
    if (configMimeType === "application/json") {
        let rawConfigData = fs.readFileSync(configPath, "utf8");
        if (rawConfigData !== "") {
            const config = JSON.parse(rawConfigData);
            useProject(config);
        }
        else {
            issueWarning("Project file is empty at: " + configPath);
        }
    }
    else if (configMimeType === "application/javascript") {
        import(configPath).then((config) => __awaiter(void 0, void 0, void 0, function* () {
            const configData = config.default;
            useProject(configData);
        }));
    }
}
else if (args._default[0]) {
    const runSingleFile = () => {
        console.clear();
        let inputFile = args._default[0];
        let outputFile;
        if (args.output == "") {
            outputFile = path.basename(inputFile) + ".html";
        }
        else {
            outputFile = path.resolve(process.cwd(), args.output);
        }
        console.log(`Compiling ${inputFile} to ${outputFile}`);
        let content = readParseFile(inputFile, shared.env);
        if (args.markdown === false) {
            let html = makeHTML(content, inputFile);
            fs.writeFileSync(outputFile, html);
        }
        else {
            fs.writeFileSync(outputFile, content);
        }
    };
    if (args.watch === true) {
        new FileWatcher(shared.ROOT, runSingleFile);
    }
    else {
        runSingleFile();
    }
}
function getInputFiles() {
    let files = [];
    // Recursively loop through all the files and push their names into the files array
    const recurse = (dir, parent) => {
        const list = fs.readdirSync(dir);
        for (const file of list) {
            const filePath = path.join(dir, file);
            const relPath = path.join(parent, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                recurse(filePath, relPath);
            }
            else if (testInclude(relPath) && relPath.endsWith("mpp")) {
                files.push(relPath);
            }
        }
    };
    recurse(shared.ROOT, "");
    return files;
}
function loadHeaderFile() {
    if (shared.config.headerFile) {
        return fs.readFileSync(path.join(shared.ROOT, shared.config.headerFile), "utf8");
    }
    return "";
}
/**
 * A function to resolve any link following this syntax: "!`<name>`" by trying to find a file that might correspond to this name.
 * @date 6/14/2022 - 6:53:17 PM
 */
function resolveLinks(content, file) {
    // Get a list of all files inside the source directory.
    const files = getInputFiles();
    return content.replace(/!`(.*?)`/g, (all, name) => {
        // Append all file's names to the list of files.
        let bestMatch = 0, bestMatchPath;
        let fileNameList = files.map(x => [x, path.basename(x)]).concat(files.map(x => [x, x]));
        // Loop through all files trying to find the best matching substring
        for (const str of fileNameList) {
            let similarity = stringSimilarity.compareTwoStrings(str[1], name);
            if (similarity > bestMatch) {
                bestMatchPath = str[0];
                bestMatch = similarity;
            }
        }
        if (bestMatch > 0.5) {
            // Get the target file's basename as a title of the link
            let title = path.parse(path.basename(bestMatchPath)).name;
            // Get the relative path to the target file
            let relativePath = "/" + path.relative(shared.ROOT, bestMatchPath);
            // Change the file extension
            relativePath = changeExtension(relativePath, shared.config.compilerOptions.outputHTML ? "html" : "md");
            return `[${title}](${relativePath})`;
        }
        issueWarning("Could not find target for: '" + name + "' in (" + file + "), maybe you should be a little more concrete.");
        return all.substring(1);
    });
}
var MarkdownType;
(function (MarkdownType) {
    MarkdownType[MarkdownType["Image"] = 0] = "Image";
    MarkdownType[MarkdownType["Link"] = 1] = "Link";
    MarkdownType[MarkdownType["AutoResolveLink"] = 2] = "AutoResolveLink";
})(MarkdownType || (MarkdownType = {}));
function matchMarkdownLinks(content) {
    let firstHand = Array.from(content.matchAll(/\[(.*?)\]\((.*?)\)/g)).map(x => {
        return {
            start: x.index,
            end: x.index + x[0].length,
            name: x[1],
            link: x[2],
            type: MarkdownType.Link
        };
    });
    let images = Array.from(content.matchAll(/!\[(.*?)\]\((.*?)\)/g)).map(x => {
        return {
            start: x.index,
            end: x.index + x[0].length,
            name: x[1],
            link: x[2],
            type: MarkdownType.Image
        };
    });
    let autoResolve = Array.from(content.matchAll(/!`(.*?)`/g)).map(x => {
        return {
            start: x.index,
            end: x.index + x[0].length,
            name: x[1],
            link: tryResolveLink(x[1]),
            type: MarkdownType.AutoResolveLink
        };
    });
    return autoResolve.concat(images).concat(firstHand);
}
function tryResolveLink(name) {
    const files = getInputFiles();
    // Append all file's names to the list of files.
    let score = 0, bestMatchPath;
    let fileNameList = files.map(x => [x, path.basename(x)]).concat(files.map(x => [x, x]));
    // Loop through all files trying to find the best matching substring
    for (const str of fileNameList) {
        let similarity = stringSimilarity.compareTwoStrings(str[1], name);
        if (similarity > score) {
            bestMatchPath = str[0];
            score = similarity;
        }
    }
    if (score > 0.5) {
        return bestMatchPath;
    }
    return null;
}
function createDependencyGraph() {
    let graph = new Graph();
    let files = getInputFiles();
    for (const file of files) {
        graph.addNode(file);
        let content = readParseFile(file, shared.env);
        const links = matchMarkdownLinks(content);
        // We will have to check if there are any links that are duplicates of others since they can look different but resolve to the same file.
        // Loop through all links and only push to a new array if they don't exist yet.
        for (const link of links) {
            if (link.type === MarkdownType.AutoResolveLink) {
                if (link.link) {
                    graph.addEdge(file, link.link);
                }
            }
            else {
                graph.addEdge(file, link.link);
            }
        }
    }
    console.log(graph.routes({ from: "index.mpp" }).map(x => x.path));
}
function run() {
    shared.errors = 0;
    let date = new Date();
    let time = `[${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}]`;
    let cStart = Date.now();
    console.clear();
    createDependencyGraph();
    process.stdout.write(`${time} File change detected. Starting compilation...\n`);
    const files = getInputFiles();
    // Loop through all existing files
    for (const file of files) {
        if (file.endsWith("mppm")) {
            // If the file is a module, we will just continue.
            process.stdout.write("Skipping module: " + file + "\n");
            continue;
        }
        const dependencies = getDependencies(file);
        // Loop through the dependencies array and check if the file exists, if so, copy it to the target directory.
        for (const dependency of dependencies) {
            // Check if the dependency matches the config includeAssets regexp
            const dependencyPath = path.join(shared.ROOT, dependency);
            if (shared.config.checkAssets(dependencyPath)) {
                if (fs.existsSync(dependencyPath)) {
                    const targetPath = path.join(shared.config.outDir, dependency);
                    const targetDir = path.dirname(targetPath);
                    if (!fs.existsSync(targetDir)) {
                        fs.mkdirSync(targetDir, { recursive: true });
                    }
                    fs.copyFileSync(dependencyPath, targetPath);
                }
            }
        }
        let content = {
            md: readParseFile(file, shared.env),
            html: "",
        };
        // Apply our custom link resolving technique
        content.md = resolveLinks(content.md, file);
        content.md = shared.config.resultModifier.before(content.md);
        // Now we will generate the HTML if requested.
        if (shared.config.compilerOptions.outputHTML) {
            content.html = makeHTML(content.md, file);
        }
        let newPath = path.join(shared.ROOT, shared.config.outDir, changeExtension(file, shared.config.compilerOptions.outputHTML ? "html" : "md"));
        fs.mkdir(path.dirname(newPath), { recursive: true }, (err) => {
            if (err)
                throw err;
            fs.writeFileSync(newPath, shared.config.compilerOptions.outputHTML
                ? content.html
                : content.md);
        });
    }
    let timeTaken = `${Math.round(Date.now() - cStart)}ms`;
    process.stdout.write(`${time} Found ${shared.errors} errors. Took: ${timeTaken}. Watching for file changes...\n`);
}

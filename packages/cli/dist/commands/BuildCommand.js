var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadPreprocessors } from "../Preprocessors.js";
import { loadBackend } from "../Backends.js";
import * as fs from "fs";
import { DependencyType } from "../types/dependencies.type.js";
import { loadRenderer } from "../Renderer.js";
import chokidar from "chokidar";
import { loadConfig, loadConfigFile, validateConfig } from "../Config.js";
import { loadSummaryFile } from "../summary.js";
import { MarkdownPlusCompiler } from "@markdownplus/core";
import path from "path";
import { serve } from "../ServeDirectory.js";
import { Context } from "../shared.js";
export default function buildCommand(args) {
    const startServer = args.serve || false;
    const watch = args.watch || false;
    let root = process.cwd();
    if (args.default && args.default.length == 1) {
        root = getRoot(args.default[0]);
    }
    /**
     * We need to load the config before doing anything else.
     * The config contains information about the backends, preprocessors and the renderer to use.
     * Loading these is asynchronous.
     */
    var config = args.project ? loadConfigFile(args.project) : loadConfig(root);
    config = validateConfig(config);
    const out = path.join(root, config.outDir);
    // We need to generate the output folder if it doesn't exist.
    if (!fs.existsSync(out)) {
        fs.mkdirSync(out);
    }
    /**
     * If the user wanted to start a local server we will launch it on the out directory.
     */
    if (startServer) {
        serve(out);
    }
    const compiler = new MarkdownPlusCompiler(root);
    (() => __awaiter(this, void 0, void 0, function* () {
        /**
         * Load all preprocessors and the backend.
         * The preprocessors will be in the correct order already.
         */
        const preprocessors = yield loadPreprocessors(config, out);
        const backend = yield loadBackend(config, out);
        const renderer = yield loadRenderer(config, out);
        function transformContent(content) {
            // First we need to compile the file. This will make sure there is no Gyro code left over.
            // Since the compilation takes care of providing us with all dependencies we can just store them for later.
            const { markdown, dependencies } = compiler.compile(content);
            content = markdown;
            for (const preprocessor of preprocessors) {
                content = preprocessor(content);
            }
            // The backend can now do it's job of transforming the markdown into the correct target language.
            const backendProcessed = backend(content);
            content = backendProcessed.content;
            const metadata = backendProcessed.metadata;
            return { content, dependencies, metadata };
        }
        function transformSingleFile(fileContent) {
            const { content, dependencies, metadata } = transformContent(fileContent);
            const rendered = renderer(content, metadata);
            return { rendered, dependencies };
        }
        function runAll() {
            const summary = loadSummaryFile(root);
            /**
             * We need to have a summary file, this is where we base all our assumptions about the directory structure off.
             * If it does not exist we will have to exit.
             */
            if (summary === null) {
                console.error("No summary file could be found in the provided folder.");
                process.exit(1);
            }
            else if (summary === "") {
                console.error("The summary is empty.");
                process.exit(1);
            }
            // Store the nested dependencies to provide some info on them.
            const nestedDeps = [];
            const { content, dependencies } = transformContent(summary);
            const changes = recurseDeps(dependencies);
            const summaryContent = applyTargetChanges(changes, content);
            const assets = path.join(out, "assets");
            if (!fs.existsSync(assets)) {
                fs.mkdirSync(assets);
            }
            fs.writeFileSync(path.join(assets, "summary.html"), summaryContent);
            /**
             * Once we know what we're dealing with in the summary we can start looping through all dependencies (all the files the summary links to).
             * And recursively transform them and sort them into their correct output folder.
             */
            function recurseDeps(deps) {
                let targetChanges = {};
                for (const dep of deps) {
                    if (dep.data.type === DependencyType.LINK) {
                        // We've found a link, we now need to check if it points to a markdown file so we can continue iterating.
                        if (dep.data.path.endsWith(".md")) {
                            // We will continue recursively transforming the file.
                            // Let's load the file.
                            if (path.isAbsolute(dep.data.path)) {
                                let newPath = path.join(root, dep.data.path);
                                if (fs.existsSync(newPath)) {
                                    let file = fs.readFileSync(newPath, 'utf8');
                                    // We're lucky, the file exists and we can continue.
                                    var { content, dependencies, metadata } = transformContent(file);
                                    nestedDeps.push(...dependencies);
                                    const changes = recurseDeps(dependencies);
                                    // We need to reassign all targets, since they would originally point to the markdown input file.
                                    content = applyTargetChanges(changes, content);
                                    // We need to write the result to an output file.
                                    const outputFile = changeExtension(path.join(out, dep.data.path), "html");
                                    // Check if the folder exists, if it doesn't we want to create it.
                                    if (!fs.existsSync(path.dirname(outputFile))) {
                                        fs.mkdirSync(path.dirname(outputFile), { recursive: true });
                                    }
                                    // Now the only thing left is to render the contents and we can write them to file.
                                    const rendered = renderer(content, metadata);
                                    fs.writeFileSync(outputFile, rendered);
                                    // Register a new change of targets.
                                    targetChanges[dep.data.path] = changeExtension(dep.data.path, "html");
                                }
                            }
                        }
                    }
                    else if (dep.data.type === DependencyType.IMAGE) {
                        // The file we're dealing with is an image, we should move it into the "assets" folder.
                        const assets = path.join(out, "assets");
                        if (!fs.existsSync(assets)) {
                            fs.mkdirSync(assets);
                        }
                        let newPath, oldPath;
                        if (path.isAbsolute(dep.data.path)) {
                            oldPath = dep.data.path;
                            newPath = path.join(assets, path.basename(dep.data.path));
                        }
                        else {
                            oldPath = path.join(root, dep.data.path);
                            newPath = path.join(assets, path.basename(dep.data.path));
                        }
                        if (fs.existsSync(oldPath)) {
                            fs.copyFileSync(oldPath, newPath);
                            targetChanges[oldPath] = newPath;
                        }
                    }
                }
                return targetChanges;
            }
            return { deps: dependencies, nested: dependencies };
        }
        runAll();
        if (watch) {
            function runAndRenderOutput() {
                const stop = Context.Measure();
                Context.Clear();
                Context.PrintHeaders();
                Context.log("File change detected, compiling...");
                const { deps, nested } = runAll();
                Context.log("Compilation Finished. Took " + stop() + "ms");
                Context.log(deps.length + " dependencies were followed.");
                Context.log(nested.length + " nested dependencies were followed.");
            }
            chokidar.watch(root).on("add", (event, file) => {
                runAndRenderOutput();
            }).on("unlink", (event, file) => {
                runAndRenderOutput();
            }).on("change", (file) => {
                if (file.match(/SUMMARY\.md/g)) {
                    runAndRenderOutput();
                    return;
                }
                if (!file.match(out)) {
                    const stop = Context.Measure();
                    Context.Clear();
                    Context.PrintHeaders();
                    Context.log("File change detected, compiling...");
                    // We only need to re-execute on the path that has changed, everything else is just excessive...
                    let fileContent = fs.readFileSync(file, "utf8");
                    let { rendered, dependencies } = transformSingleFile(fileContent);
                    let output = changeExtension(file.replace(root, out), "html");
                    Context.log("Compilation Finished. Took " + stop() + "ms");
                    Context.log(dependencies.length + " dependencies were followed.");
                    fs.writeFileSync(output, rendered);
                }
            });
        }
    }))();
}
function applyTargetChanges(changes, content) {
    for (const original in changes) {
        let newTarget = changes[original];
        content = content.replace(new RegExp(original, "g"), newTarget);
    }
    return content;
}
function changeExtension(file, extension) {
    let parsed = path.parse(file);
    return path.join(path.dirname(file), parsed.name + "." + extension);
}
function getRoot(str) {
    if (path.isAbsolute(str)) {
        return str;
    }
    return path.join(process.cwd(), str);
}

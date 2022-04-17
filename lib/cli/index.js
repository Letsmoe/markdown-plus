var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { cArgs, COLORS, color } from "./cargs.js";
import * as fs from "fs";
import * as path from "path";
import { shared, testInclude } from "./shared.js";
import { readParseFile } from "./parse-file.js";
import { FileWatcher } from "./file-watcher.js";
import { issueWarning } from "./console-dispatcher.js";
import { checkConfig } from "./config.js";
const args = cArgs(process.argv.slice(2))
    .options({
    watch: {
        alias: "w",
        type: "boolean",
        desc: "Whether or not to watch the entry file for changes.",
        default: false,
        required: false,
    },
    project: {
        alias: "p",
        type: "string",
        desc: "The project to use for the compilation.",
        default: "",
        required: true,
    }
})
    .usage("Usage: npx cmpp <entry> <output>")
    .set("CAPTURE_DEFAULTS", false)
    .help().args;
const pad = (str) => {
    return str.toString().padStart(2, "0");
};
const changeExtension = (file, ext) => {
    return file.substring(0, file.lastIndexOf(".")) + "." + ext;
};
function useProject(config) {
    console.log(`Using project ${args.project}`);
    // Check if the given config follows the required schema. May lead to early exit.
    shared.config = checkConfig(config);
    // All paths in the config file are relative to the location of the file so we will just use it's parent directory and redirect from there.
    shared.ROOT = path.join(process.cwd(), path.dirname(args.project), config.rootDir) || path.dirname(args.project);
    process.chdir(shared.ROOT);
    if (config.watch == true || args.watch == true) {
        // Determine whether a FileWatcher should be assigned to the projects root folder.
        new FileWatcher(shared.ROOT, run);
    }
    run();
}
const configPath = path.join(process.cwd(), args.project);
if (configPath.endsWith("json")) {
    let rawConfigData = fs.readFileSync(configPath, "utf8");
    if (rawConfigData !== "") {
        const config = JSON.parse(rawConfigData);
        useProject(config);
    }
    else {
        issueWarning("Project file is empty at: " + configPath);
    }
}
else if (configPath.endsWith("js")) {
    import(configPath).then((config) => __awaiter(void 0, void 0, void 0, function* () {
        const configData = config.default;
        useProject(configData);
    }));
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
function run() {
    shared.errors = 0;
    let date = new Date();
    let time = `[${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}]`;
    let cStart = Date.now();
    console.clear();
    process.stdout.write(`${time} File change detected. Starting compilation...\n`);
    const files = getInputFiles();
    // Loop through all existing files
    for (const file of files) {
        if (file.endsWith("mppm")) {
            // If the file is a module, we will just continue.
            process.stdout.write("Skipping module: " + file + "\n");
            continue;
        }
        let content = readParseFile(file, shared.env);
        content = shared.config.resultModifier.before(content);
        // Now we will generate the HTML if requested.
        if (shared.config.compilerOptions.outputHTML) {
            content = shared.converter.makeHtml(content);
            content = content.replace(/<head>(.*?)<\/head>/gms, `<head><link rel="stylesheet" href="${shared.config.css}">$1</head>${loadHeaderFile()}`);
            content = shared.config.resultModifier.after(content);
        }
        let newPath = path.join(shared.ROOT, shared.config.outDir, changeExtension(file, "html"));
        fs.mkdir(path.dirname(newPath), { recursive: true }, (err) => {
            if (err)
                throw err;
            fs.writeFileSync(newPath, content);
        });
    }
    let timeTaken = color(`${Math.round(Date.now() - cStart)}ms`, COLORS.YELLOW);
    process.stdout.write(`${time} Found ${shared.errors} errors. Took: ${timeTaken}. Watching for file changes...\n`);
}

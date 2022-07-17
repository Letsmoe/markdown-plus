#!/usr/bin/env node
import * as path from "path";
import * as fs from "fs";
import { warn, error } from "../console-dispatcher.js";
import MarkdownPlusCompiler from "../index.js";
import { defaultConfig, validateConfig } from "../config.js";
import { shared } from "../shared.js";
import chokidar from "chokidar";
import args from "./args.js";
import liveServer from "live-server";
import crypto from "crypto";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pad = (str) => {
    return str.toString().padStart(2, "0");
};
const sha256 = (str) => crypto.createHash('md5').update(str, "utf-8").digest('hex');
function isExcludePath(file, config) {
    return config.exclude.some((v) => {
        let r = new RegExp(v);
        return r.test(file);
    });
}
function generateMetadata(metadata) {
    let str = "";
    for (const key in metadata) {
        let value = metadata[key];
        if (key === "title") {
            str += `<title>${value}</title>`;
        }
        else if (key === "description") {
            str += `<meta name="description" content="${value}">`;
        }
        else if (key === "keywords") {
            str += `<meta name="keywords" content="${value}">`;
        }
        else if (key === "author") {
            str += `<meta name="author" content="${value}">`;
        }
        else if (key === "date") {
            str += `<meta name="date" content="${value}">`;
        }
        else if (key === "copyright") {
            str += `<meta name="copyright" content="${value}">`;
        }
        else if (key === "scripts") {
            for (const script of value) {
                str += `<script src="${script}"></script>`;
            }
        }
        else if (key === "styles") {
            for (const style of value) {
                str += `<link rel="stylesheet" href="${style}">`;
            }
        }
    }
    return str;
}
// Check if a project was given, if not check if a default path was given as first argument.
let config = defaultConfig;
let compiler;
if (args.project) {
    const configPath = path.join(process.cwd(), args.project);
    try {
        let raw = fs.readFileSync(configPath, "utf8");
        config = validateConfig(JSON.parse(raw));
    }
    catch (e) {
        error("Failed reading config: " + e);
    }
    const root = path.join(process.cwd(), path.dirname(args.project), config.rootDir);
    const out = path.join(process.cwd(), path.dirname(args.project), config.outDir);
    const scripts = path.join(out, "scripts");
    const assets = path.join(out, "assets");
    // Find the corresponding playground providers to enable using the code as a playground, allowing to execute on it.
    if (config.playgrounds.length > 0) {
        config.playgrounds.forEach(playground => {
            // Move the provider into the scripts folder.
            let [file, content] = importPlayground(playground.provider);
            if (file && content) {
                // Write into the scripts folder, we will just use the name part of the given path for that.
                let name = sha256(playground.provider) + path.parse(file).ext;
                let newPath = path.join(scripts, name);
                fs.writeFileSync(newPath, content);
                for (const match of playground.match) {
                    shared.scripts[match] = "/scripts/" + name;
                }
            }
        });
    }
    fs.writeFileSync(path.join(scripts, "docs.js"), `const p=${JSON.stringify(shared.scripts)};for(let e in p){let l=p[e];Array.from(document.querySelectorAll(\`code.\${e}\`)).length>0&&import(l).then((e=>{e.default(document)}))}`);
    compiler = new MarkdownPlusCompiler(config, root);
    function editSummaryFile(file) {
        let { html, markdown, metadata, deps } = compiler.compile(file, true, shared.env);
        fs.writeFileSync(path.join(scripts, "summary.js"), `const s=\`${html.replace(/`/g, "\\`")}\`; document.getElementById("sidebar").innerHTML = s;`);
    }
    if (config.watch) {
        chokidar
            .watch(root, { persistent: true })
            .on("all", function (event, file) {
            if (file.endsWith("SUMMARY.mpp")) {
                editSummaryFile(file);
                return;
            }
            if (!isExcludePath(file, config) && (file.endsWith("md") || file.endsWith("mpp"))) {
                let date = new Date();
                let time = `[${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}]`;
                let cStart = Date.now();
                console.clear();
                if (config.serve) {
                    console.log("Opened server on http://localhost:" + config.serverOptions.port || 8181);
                }
                console.log(`${time} File change detected. Starting compilation...`);
                var { html, markdown, metadata, deps } = compiler.compile(file, true, shared.env);
                // Every dependency outside of the root directory will have to be moved into it.
                for (const dep of deps) {
                    if (dep.data.path.startsWith("http")) {
                        continue;
                    }
                    let target = path.join(path.dirname(file), dep.data.path);
                    if (!target.match(root)) {
                        // The target is outside the root folder, we will have to move it inside.
                        let newTarget = path.join(assets, dep.data.path.split("/").pop());
                        if (fs.existsSync(target)) {
                            fs.copyFileSync(target, newTarget);
                            markdown = markdown.replace(new RegExp(dep.data.path, "g"), newTarget.replace(out, ""));
                            html = html.replace(new RegExp(dep.data.path, "g"), newTarget.replace(out, ""));
                        }
                    }
                }
                metadata.title = metadata.title || "My Documentation";
                // Get the relative file path of the current file, we will use it to write it into the target folder.
                const relPath = file.replace(root, "");
                const rewrittenPath = changeExtension(relPath, config.compilerOptions.outputHTML ? "html" : "md");
                let fullPath = path.join(out, rewrittenPath);
                fs.mkdirSync(path.dirname(fullPath), { recursive: true });
                fs.writeFileSync(fullPath, config.compilerOptions.outputHTML ? `<!DOCTYPE html><html><head><link rel="stylesheet" type="text/css" href="/style/main.css">${generateMetadata(metadata)}</head><body><div id="sidebar" class="sidebar"></div><div class="inner-body">${html}</div></body><script src="/scripts/docs.js"></script><script src="/scripts/summary.js"></script></html>` : markdown);
                let timeTaken = `${Math.round(Date.now() - cStart)}ms`;
                console.log(`${time} Compilation Finished. Took: ${timeTaken}. Watching for file changes...`);
            }
        });
    }
    if (config.serve === true) {
        liveServer.start({
            port: config.serverOptions.port || 8181,
            root: config.outDir,
            open: config.serverOptions.open || false,
            logLevel: 0,
        });
    }
}
else {
    compiler = new MarkdownPlusCompiler(config, process.cwd());
    const runSingleFile = (file, output) => {
        if (!output) {
            output = path.parse(file).name + (args.markdown ? ".md" : ".html");
        }
        console.log(`Compiling ${file} to ${output}`);
        output = path.join(process.cwd(), output);
        let { html, metadata, markdown } = compiler.compile(file, true, shared.env);
        if (config.compilerOptions.outputHTML) {
            fs.writeFileSync(output, `<!DOCTYPE html><html><head>${generateMetadata(metadata)}</head><body>${html}</body></html>`);
        }
        else {
            fs.writeFileSync(output, markdown);
        }
    };
    runSingleFile(args.default[0], args.output);
}
function changeExtension(file, ext) {
    return path.dirname(file) + "/" + path.parse(file).name + "." + ext;
}
function importPlayground(file) {
    if (!fs.existsSync(file)) {
        // Assume the "file" is an npm package, let's find and read it.
        try {
            let path = require.resolve(file);
            // The "path" is already pointing to the npm package's "main", we can just read it.
            let content = fs.readFileSync(path).toString();
            return [path, content];
        }
        catch (err) {
            warn(`Error importing playground module '${file}'`);
            return ["", ""];
        }
    }
    else {
        // Read the file and return an array of filename and content
        let content = fs.readFileSync(file).toString();
        return [file, content];
    }
}

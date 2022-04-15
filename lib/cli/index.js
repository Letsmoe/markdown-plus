import { cArgs, COLORS, color } from "./cargs.js";
import { parseAndEvaluate } from "../md/parse-evaluate.js";
import { Environment } from "../interpreter.js";
import * as fs from "fs";
import * as showdown from "showdown";
import * as chokidar from "chokidar";
const args = cArgs(process.argv.slice(2))
    .options({
    "entry": {
        alias: "e",
        type: "string",
        desc: "The file to read from. Acting as the entry for the script.",
        default: "",
        required: true
    },
    "output": {
        alias: "o",
        type: "string",
        desc: "The file to write to. If not specified, the output will be written to stdout.",
        default: "",
        required: false
    },
    "html": {
        alias: "h",
        type: "boolean",
        desc: "Whether or not to output HTML.",
        default: false,
        required: false
    },
    "watch": {
        alias: "w",
        type: "boolean",
        desc: "Whether or not to watch the entry file for changes.",
        default: false,
        required: false
    }
})
    .usage("Usage: npx cmpp <entry> <output>")
    .set("CAPTURE_DEFAULTS", false)
    .help()
    .args;
// Get a filled environment from the executed mpp file.
const globalEnv = new Environment(null);
// Fill the environment with a print method that writes to stdout
globalEnv.set("print", (...args) => {
    process.stdout.write(args.join(" ") + "\n");
});
globalEnv.set("include", (filename) => {
    const content = readParseFile("/src/test2.mpp", globalEnv);
    return content;
});
function readParseFile(filename, env) {
    var content = fs.readFileSync(process.cwd() + "/" + filename, "utf8");
    var inlineCode = [];
    content = content.replace(/\{%(.*?)%\}/gms, (all, first) => {
        inlineCode.push(first);
        return "";
    });
    parseAndEvaluate(inlineCode.join(""), env);
    const variables = env.vars;
    // env now contains all variables we need to fill the document.
    content = content.replace(/\{\{(.*?)\}\}/gm, (all, first) => {
        let value = variables[first.trim()];
        if (value === undefined) {
            value = "";
            process.stdout.write(color(`[WARN]	Encountered undefined variable: '${first.trim()}' at ${filename}\n`, COLORS.YELLOW));
        }
        return value;
    });
    return content;
}
if (args.entry) {
    const entry = args.entry;
    const output = args.output;
    const watch = args.watch;
    function run(changedPath = "") {
        if (changedPath) {
            // Check if the changed path has the `mpp` file extension
            if (changedPath.endsWith(".mpp")) {
                // If so, we need to re-run the entire script.
                process.stdout.write(color(`[INFO]	File changed: '${changedPath}'\n`, COLORS.GREEN));
            }
            else {
                return;
            }
        }
        // We will generate markdown or HTML depending on what the user wants.
        const toHTML = args.html;
        var content = readParseFile(entry, globalEnv);
        // Now we will generate the HTML if requested.
        if (toHTML) {
            // @ts-ignore
            const converter = new showdown.default.Converter();
            content = converter.makeHtml(content);
        }
        // Check if the output was set, else write to stdout.
        if (output) {
            fs.writeFileSync(process.cwd() + "/" + output, content);
            process.stdout.write("Successfully wrote to: " + output + "\n");
        }
        else {
            process.stdout.write(content + "\n");
        }
    }
    if (watch) {
        chokidar.watch(process.cwd())
            .on("add", function (path) {
            run(path);
        })
            .on("change", function (path) {
            run(path);
        }).on("unlink", function (path) {
            run(path);
        });
    }
    else {
        run();
    }
}

import path from "path";
import * as fs from 'fs';
import __dirname from "./__dirname.js";
const defaultConfig = {
    outDir: "./out/",
    rootDir: "./",
    exclude: [],
    serve: false,
    serverOptions: {
        port: 8080,
        open: true,
    },
    watch: false,
    linkValidation: true,
    autoResolve: true,
    playgrounds: [{
            match: ["js", "javascript"],
            use: "mdp-js-playground"
        }],
    backend: path.join(__dirname, "./backend/html.js"),
    preprocessors: [{
            use: path.join(__dirname, "preprocessors/labels.js")
        }],
    environment: "__default",
    renderer: "@markdownplus/html-renderer"
};
// Create a function that deeply merges two objects
function deepMerge(target, source) {
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            if (typeof source[key] === "object") {
                target[key] = deepMerge(target[key], source[key]);
            }
            else {
                target[key] = source[key];
            }
        }
    }
    return target;
}
function validateConfig(config) {
    config = deepMerge(defaultConfig, config);
    if (config.outDir == "") {
        console.error("No output directory specified.");
    }
    return config;
}
function loadConfig(root) {
    if (!path.isAbsolute(root)) {
        root = path.join(process.cwd(), root);
    }
    let file = path.join(root, 'docks.json');
    return loadConfigFile(file);
}
function loadConfigFile(file) {
    if (!fs.existsSync(file)) {
        console.error("The project file " + file + " does not exist.");
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
}
export { loadConfigFile, loadConfig, validateConfig };

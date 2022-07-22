import path from "path";
import { error } from "./console-dispatcher.js";
import __dirname from "./__dirname.js";
const defaultConfig = {
    outDir: "./",
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
    backend: path.join(__dirname, "./backends/html-backend.js"),
    preprocessors: [{
            use: path.join(__dirname, "./preprocessors/playgrounds.js")
        }, {
            use: path.join(__dirname, "./preprocessors/footnotes.js")
        }],
    environment: "__default",
    renderer: "@mdplusplus/html-renderer"
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
        error("No output directory specified.");
    }
    return config;
}
export { validateConfig, defaultConfig };

import { error } from "./console-dispatcher.js";
const defaultConfig = {
    outDir: "./",
    rootDir: "./",
    exclude: [],
    serve: false,
    serverOptions: {
        port: 8080,
        open: true,
    },
    compilerOptions: {
        outputHTML: true,
    },
    watch: false,
    linkValidation: true,
    autoResolve: true,
    playgrounds: [{
            match: ["js", "javascript"],
            provider: "mdp-js-playground"
        }]
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

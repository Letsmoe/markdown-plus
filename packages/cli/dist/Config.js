import path from "path";
import * as fs from "fs";
import __dirname from "./__dirname.js";
const defaultConfig = {
    themeConfig: {
        logo: "",
        nav: [],
        footer: {
            message: "",
            copyright: "",
        },
        editLink: {
            pattern: "",
            text: "",
        },
        docFooter: {
            prev: "",
            next: "",
        },
    },
    out: "./out/",
    title: "",
    exclude: [],
    serve: false,
    serverOptions: {
        port: 8080,
        open: true,
    },
    watch: false,
    linkValidation: true,
    autoResolve: true,
    playgrounds: [
        {
            match: ["js", "javascript"],
            use: "mdp-js-playground",
        },
    ],
    backend: path.join(__dirname, "./backend/html.js"),
    preprocessors: [
        {
            use: path.join(__dirname, "preprocessors/labels.js"),
        },
    ],
    environment: "__default",
    renderer: "@markdownplus/html-renderer",
    head: [],
};
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
}
/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function deepMerge(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key])
                    Object.assign(target, { [key]: {} });
                deepMerge(target[key], source[key]);
            }
            else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return deepMerge(target, ...sources);
}
function validateConfig(config) {
    config = deepMerge(defaultConfig, config);
    if (config.out == "") {
        console.error("No output directory specified.");
    }
    return config;
}
function loadConfig(root) {
    /**
     * The config will be located inside the .docks folder (.docks/config.json)
     */
    if (!path.isAbsolute(root)) {
        root = path.join(process.cwd(), root);
    }
    let file = path.join(root, ".docks", "config.json");
    return loadConfigFile(file);
}
function loadConfigFile(file) {
    if (!fs.existsSync(file)) {
        console.error("The project file '" + file + "' does not exist.");
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(file, "utf-8"));
}
export { loadConfigFile, loadConfig, validateConfig };

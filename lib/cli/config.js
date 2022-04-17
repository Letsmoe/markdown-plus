import { issueError } from "./console-dispatcher.js";
import { shared } from "./shared.js";
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
function checkConfig(config) {
    config = deepMerge(shared.config, config);
    if (config.outDir == "") {
        issueError("No output directory specified.");
    }
    return config;
}
export { checkConfig };

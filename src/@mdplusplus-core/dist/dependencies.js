import { shared } from "./shared.js";
import * as path from "path";
import * as fs from "fs";
function getDependencies(file) {
    let filePath = path.join(shared.ROOT, file);
    let dependencies = [];
    // Read the file from storage, then match all markdown links and write the links into the dependencies array
    let fileContents = fs.readFileSync(filePath, "utf8");
    let matches = fileContents.matchAll(/\[.*\]\((.*)\)/g);
    for (let match of matches) {
        let dependency = match[1];
        if (dependency.startsWith("http") || dependency.startsWith("//")) {
            continue;
        }
        if (dependency.startsWith("/")) {
            dependencies.push(dependency);
        }
        else {
            dependencies.push(path.join(path.dirname(file), dependency));
        }
    }
    return dependencies;
}
export { getDependencies };

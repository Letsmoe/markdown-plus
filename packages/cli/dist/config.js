import * as fs from 'fs';
import * as path from 'path';
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
export { loadConfigFile, loadConfig };

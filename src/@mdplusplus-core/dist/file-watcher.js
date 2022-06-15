import * as chokidar from "chokidar";
import { issueWarning } from "./console-dispatcher.js";
import { testInclude } from "./shared.js";
class FileWatcher {
    constructor(watchPath, callback) {
        chokidar
            .watch(watchPath, { persistent: true })
            .on("all", function (event, path) {
            if (testInclude(path)) {
                callback(path);
            }
            else {
                issueWarning(`File was not included in the entry file. Ignoring...`);
            }
        });
    }
}
export { FileWatcher };

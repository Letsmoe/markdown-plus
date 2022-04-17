import * as chokidar from "chokidar";
import { issueWarning } from "./console-dispatcher.js";
import { testInclude } from "./shared.js";
class FileWatcher {
    constructor(watchPath, callback) {
        chokidar
            .watch(watchPath, { persistent: true })
            .on("add", function (path) {
            if (testInclude(path)) {
                callback(path);
            }
            else {
                issueWarning(`File added but was not included in the entry file. Ignoring...`);
            }
        })
            .on("change", function (path) {
            if (testInclude(path)) {
                callback(path);
            }
            else {
                issueWarning(`File changed but was not included in the entry file. Ignoring...`);
            }
        })
            .on("unlink", function (path) {
            if (testInclude(path)) {
                callback(path);
            }
            else {
                issueWarning(`File removed but was not included in the entry file. Ignoring...`);
            }
        });
    }
}
export { FileWatcher };

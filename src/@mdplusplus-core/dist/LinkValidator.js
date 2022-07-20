var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
import stringSimilarity from "string-similarity";
const defaultValidationConfig = {
    validateOnline: true,
    ignoreExtensions: [],
    targetDir: process.cwd(),
    timeout: 500,
    onlyFile: true,
};
class LinkValidator {
    constructor(config = {}) {
        this.config = Object.assign(defaultValidationConfig, config);
    }
    static isOnline(link) {
        if (link.startsWith("http") || link.startsWith("//")) {
            return true;
        }
        return false;
    }
    static isFile(link, onlyFile = false) {
        return (fs.existsSync(link) &&
            (onlyFile ? fs.lstatSync(link).isFile() : true));
    }
    static getAllFiles(folder, depth = Infinity, curr = 0) {
        let final = [];
        if (depth > curr) {
            let files = fs.readdirSync(folder);
            for (const file of files) {
                let newPath = path.join(folder, file);
                if (fs.lstatSync(newPath).isFile()) {
                    final.push([newPath, path.basename(newPath)]);
                }
                else if (fs.lstatSync(newPath).isDirectory()) {
                    final = final.concat(LinkValidator.getAllFiles(newPath, depth, curr + 1));
                }
            }
        }
        return final;
    }
    static findMatch(name, files) {
        // Append all file's names to the list of files.
        let score = 0, bestMatchPath;
        // Loop through all files trying to find the best matching substring
        for (const [abs, rel] of files) {
            let similarity = stringSimilarity.compareTwoStrings(rel.toLowerCase(), name.toLowerCase());
            if (similarity > score) {
                bestMatchPath = abs;
                score = similarity;
            }
        }
        if (score > 0.5) {
            return bestMatchPath;
        }
        return null;
    }
    static validate(link, config = defaultValidationConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            config = Object.assign(defaultValidationConfig, config);
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                /**
                 * Check if the given link points to an online source, if it does we need to check the response code only if the config options "validateOnline" is enabled.
                 */
                if (LinkValidator.isOnline(link)) {
                    if (config.validateOnline) {
                        const controller = new AbortController();
                        const signal = controller.signal;
                        try {
                            const response = yield fetch(link, { signal });
                            setTimeout(() => {
                                controller.abort();
                            }, config.timeout);
                            resolve(response.status == 200);
                        }
                        catch (error) {
                            resolve(false);
                        }
                    }
                    else {
                        resolve(true);
                    }
                }
                else {
                    /**
                     * We found an offline link, check the directory if the file exists.
                     * It might be an absolute path, check that first.
                     */
                    if (LinkValidator.isFile(link, config.onlyFile)) {
                        resolve(true);
                    }
                    // The path was not absolute, check if it is relative.
                    let full = path.join(config.targetDir, link);
                    if (LinkValidator.isFile(full, config.onlyFile)) {
                        resolve(true);
                    }
                    resolve(false);
                }
            }));
        });
    }
    validate(link) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield LinkValidator.validate(link, this.config);
        });
    }
}
export { LinkValidator };

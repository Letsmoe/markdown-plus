var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * A helper function that loads all preprocessors, defined inside a passed config, and returns them in order of execution.
 * @date 7/22/2022 - 5:18:06 PM
 *
 * @async
 * @param {Config} config
 * @returns {Promise<any>}
 */
function loadPreprocessors(config, out) {
    return __awaiter(this, void 0, void 0, function* () {
        const object = {};
        const loaders = yield Promise.all(config.preprocessors.map((x) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                let after = null, options = {}, name;
                if (typeof x === "string") {
                    name = x;
                }
                else {
                    name = x.use;
                    after = x.after;
                    options = x.options;
                }
                import(name).then((module) => {
                    object[name] = { name, after, options, use: module.default(options, out) };
                    resolve(name);
                }).catch(e => {
                    console.error("Error loading preprocessor, '" + name + "' does not exist.");
                    process.exit(1);
                });
            });
        })));
        const arr = [];
        const indexMap = {};
        loaders.forEach(name => {
            const loader = object[name];
            if (loader.after) {
                let index = indexMap[loader.after] || arr.length;
                arr.splice(index, 0, loader.use);
            }
            else {
                arr.unshift(loader.use);
            }
        });
        return arr;
    });
}
export { loadPreprocessors };

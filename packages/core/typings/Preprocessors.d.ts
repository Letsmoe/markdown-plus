import { Config } from "./config.type.js";
/**
 * A helper function that loads all preprocessors, defined inside a passed config, and returns them in order of execution.
 * @date 7/22/2022 - 5:18:06 PM
 *
 * @async
 * @param {Config} config
 * @returns {Promise<any>}
 */
declare function loadPreprocessors(config: Config): Promise<any>;
export { loadPreprocessors };

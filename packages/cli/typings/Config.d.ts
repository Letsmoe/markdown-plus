import { Config } from "./types/config.type.js";
declare function validateConfig(config: Config): Config;
declare function loadConfig(root: string): Config;
declare function loadConfigFile(file: string): any;
export { loadConfigFile, loadConfig, validateConfig };

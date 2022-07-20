import { Config } from "./config.type.js";
declare const defaultConfig: Config;
declare function validateConfig(config: Config): Config;
export { validateConfig, Config, defaultConfig };

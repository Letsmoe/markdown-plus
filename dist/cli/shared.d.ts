import * as showdown from "showdown";
import { Environment } from "../interpreter.js";
import { Config } from "./config.js";
import { Dependency } from "./dependency-resolver.js";
declare const testInclude: (file: string) => boolean;
declare const shared: {
    config: Config;
    ROOT: string;
    errors: number;
    warnings: number;
    converter: showdown.Converter;
    dependencies: Dependency[];
    env: typeof Environment;
};
export { shared, testInclude };

import * as showdown from "showdown";
import { Environment } from "@gyro-lang/core";
import { Config } from "./config.js";
declare const testInclude: (file: string) => boolean;
declare const shared: {
    config: Config;
    ROOT: string;
    errors: number;
    warnings: number;
    converter: showdown.Converter;
    env: Environment;
    mj: any;
};
export { shared, testInclude };

/// <reference types="showdown" />
import { Environment } from "@gyro-lang/core";
import { Config } from "./config.js";
declare const testInclude: (file: string) => boolean;
declare const defaultConfig: {
    outDir: string;
    rootDir: string;
    watch: boolean;
    include: string[];
    exclude: any[];
    css: any[];
    compilerOptions: {
        outputHTML: boolean;
    };
    serve: boolean;
    serverOptions: {
        port: number;
        host: string;
        open: boolean;
    };
    resultModifier: {
        before: (x: any) => any;
        after: (x: any) => any;
    };
    checkAssets: (x: any) => boolean;
    generateMetadata(metadata: any): string;
    linkValidation: boolean;
    wrapper: (head: string, body: string, metadata: any, source: string) => string;
};
declare const shared: {
    config: Config;
    ROOT: string;
    converter: showdown.Converter;
    env: Environment;
    mj: any;
};
export { shared, testInclude, defaultConfig };

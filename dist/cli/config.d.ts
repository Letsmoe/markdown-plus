interface Config {
    outDir: string;
    rootDir?: string;
    include?: string[];
    exclude?: string[];
    css?: string;
    watch?: boolean;
    compilerOptions?: {
        outputHTML: boolean;
    };
    headerFile?: string;
    resultModifier: {
        before: (content: string) => string;
        after: (content: string) => string;
    };
}
declare function checkConfig(config: Config): Config;
export { checkConfig, Config };

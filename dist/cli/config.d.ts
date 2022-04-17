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
}
declare function checkConfig(config: Config): Config;
export { checkConfig, Config };

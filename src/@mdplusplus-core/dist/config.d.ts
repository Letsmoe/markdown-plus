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
    generateMetadata: (metadata: any) => string;
    wrapper: (head: string, header: string, body: string, footer: string, metadata: any, source: string) => string;
    checkAssets?: (file: string) => boolean;
    linkValidation: boolean;
}
declare function checkConfig(config: Config): Config;
export { checkConfig, Config };

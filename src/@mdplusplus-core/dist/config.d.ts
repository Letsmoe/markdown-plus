interface Config {
    outDir: string;
    rootDir?: string;
    include?: string[];
    exclude?: string[];
    css?: string[];
    serve?: boolean;
    serverOptions?: {
        port?: number;
        host?: string;
        open?: boolean;
    };
    watch?: boolean;
    compilerOptions?: {
        outputHTML: boolean;
    };
    resultModifier: {
        before: (content: string) => string;
        after: (content: string) => string;
    };
    generateMetadata: (metadata: any) => string;
    wrapper: (head: string, body: string, metadata: any, source: string) => string;
    checkAssets?: (file: string) => boolean;
    linkValidation: boolean;
}
declare function checkConfig(config: Config): Config;
export { checkConfig, Config };

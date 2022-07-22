export declare type BackendFunction = (ast: any) => string;
export interface Preprocessor {
    use: string;
    backend?: string;
    options?: {
        exclude?: string[];
        [key: string]: any;
    };
    after?: string;
}
export interface Backend {
    use: string;
    options?: {
        exclude?: string[];
        [key: string]: any;
    };
}
export interface Renderer {
    use: string;
    options?: {
        [key: string]: any;
    };
}
export interface Config {
    /**
     * The directory to output to, relative to the config path.
     * @default "./"
     */
    outDir: string;
    /**
     * The root directory of the documentation.
     * @default "./"
     */
    rootDir?: string;
    /**
     * An array of Regular Expressions to exclude parts of the documentation, every match will be ignored.
     * The Regular Expression will be assumed to be global, meaning "node_modules" would match a file path like "/docs/main/node_modules/nothing.mpp"
     * @default []
     */
    exclude?: string[];
    /**
     * Whether to serve the output directory on the localhost with a server.
     * @default true
     */
    serve?: boolean;
    /**
     * An object specifying options for the server.
     */
    serverOptions?: {
        /**
         * The port where the local server will be launched on.
         * @default 3000
         */
        port?: number;
        /**
         * Whether to open the local server in the default browser.
         * @default true
         */
        open?: boolean;
    };
    /**
     * Whether to watch the root directory for changes to files.
     * @default false
     */
    watch?: boolean;
    /**
     * Whether to validate all link targets.
     * If a link is found that directs to a target that could not be found among the local files, a warning is issued.
     * Every link starting with "http://" will be assumed to have a target.
     * @default true
     */
    linkValidation: boolean;
    /**
     * Whether to resolve links following this format: [[<name>]]
     * This means that targets for files can be found in the local root directory while not having to type full filenames.
     * The best result will be used as target.
     * @default true
     */
    autoResolve: boolean;
    /**
     * An array of paths to files or node modules that provide a default export that can be used to initialize a playground.
     * The keys are the identifiers of languages the module correspond to.
     * @default {}
     */
    playgrounds: {
        match: string[];
        use: string;
    }[];
    /**
     * @default ["mdp-math", "mdp-js", "mdp-code", "mdp-tables"]
     */
    preprocessors: Preprocessor[] | string[];
    /**
     * @default "html"
     */
    backend: Backend | string;
    /**
     * An environment defines default functions that can be used in conjunction with Gyro.
     * @default "__default"
     */
    environment: {
        use: string;
        options: {
            [key: string]: any;
        };
    } | string;
    /**
     * A node module exporting a default function which can be executed to return a rendered output of the input Markdown.
     * It is given the content string as first argument and user defined options as second.
     * The returned output will be transformed once, so it can use some default values, formatted like this: {{<property>}}
     * These include:
     * ```
     * - {{APP_TITLE}} // The applications title, this can be included like this: "Backend - MyApp" where MyApp is the "APP_TITLE".
     * - {{TITLE}} // The page's title.
     * - {{AUTHOR}} // The name of the author.
     * ```
     * @default "@mdplusplus/html-renderer"
     */
    renderer: string | Renderer;
}

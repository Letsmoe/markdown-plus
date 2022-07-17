interface Config {
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
	 * An object specifying options for the compiler to use.
	 */
	compilerOptions?: {
		/**
		 * Whether to output the result as HTML or Markdown (false for Markdown).
		 * @default true
		 */
		outputHTML: boolean;
	};
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
	playgrounds: {match: string[], provider: string}[]
}

export default Config
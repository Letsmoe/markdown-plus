export interface Preprocessor {
	use: string;
	backend?: string;
	options?: {
		exclude?: string[];
		[key: string]: any;
	},
	after?: string;
}
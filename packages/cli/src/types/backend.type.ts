export type BackendFunction = (ast: any) => {content: string, metadata: {[key: string]: any}};

export interface Backend {
	use: string;
	options?: {
		exclude?: string[];
		[key: string]: any;
	}
}
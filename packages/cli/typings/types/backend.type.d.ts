export declare type BackendFunction = (ast: any) => string;
export interface Backend {
    use: string;
    options?: {
        exclude?: string[];
        [key: string]: any;
    };
}

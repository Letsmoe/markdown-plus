interface ValidationConfig {
    timeout?: number;
    validateOnline?: boolean;
    ignoreExtensions?: string[];
    targetDir?: string;
    onlyFile?: boolean;
}
declare class LinkValidator {
    private config;
    constructor(config?: ValidationConfig);
    static isOnline(link: string): boolean;
    static isFile(link: string, onlyFile?: boolean): boolean;
    static getAllFiles(folder: string, depth?: number, curr?: number): string[];
    static findMatch(name: string, files: string[]): string | null;
    static validate(link: string, config?: ValidationConfig): Promise<boolean>;
    validate(link: string): Promise<boolean>;
}
export { LinkValidator };

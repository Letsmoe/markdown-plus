import { Environment } from "@gyro-lang/core";
declare class MarkdownPlusCompiler {
    private dir;
    constructor(dir?: string);
    private eval;
    compile(content: string, env?: Environment): {
        markdown: string;
        dependencies: import("./dependencies/dependencies.type.js").Dependency[];
    };
    /**
     * A function to resolve any link following this syntax: "[[<name>]]" by trying to find a file that might correspond to this name.
     * @date 6/14/2022 - 6:53:17 PM
     */
    resolveLinks(content: string): string;
}
export { MarkdownPlusCompiler };

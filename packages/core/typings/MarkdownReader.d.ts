declare class MarkdownReader {
    constructor();
    static getAllLinks(content: string, inline?: boolean): string[];
}
export { MarkdownReader };

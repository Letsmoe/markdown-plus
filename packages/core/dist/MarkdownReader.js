class MarkdownReader {
    constructor() { }
    static getAllLinks(content, inline = false) {
        /**
         * The content will be given in Markdown, we want to return all links inside the Markdown file.
         */
        let links = [];
        Array.from(content.matchAll(/!?\[.+\]\((.+)\)/gm)).forEach(([full, link]) => {
            links.push(link);
        });
        if (inline) {
            // If we also want to match inline links, we only need to match those that point to online sources.
            Array.from(content.matchAll(/[a-z]+:\/\/[[A-Za-z0-9_.\-~?&=%]+/gm)).forEach(([link]) => {
                links.push(link);
            });
        }
        return links;
    }
}
export { MarkdownReader };

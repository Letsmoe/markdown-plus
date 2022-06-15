import Showdown from "showdown";
import { env } from "./interpreter-environment.js";
import * as mime from "mime-types";
//@ts-ignore
import * as mathjax from "mathjax";
// Create a function that loops through the include conditions in shared.config and test whether the given regex matches the file name
const testInclude = (file) => {
    for (const req of shared.config.include) {
        let reg = new RegExp(req);
        if (reg.test(file)) {
            return true;
        }
    }
    return false;
};
mathjax
    .init({
    loader: { load: ["input/tex", "output/svg"] },
})
    .then((mj) => {
    shared.mj = mj;
})
    .catch(() => console.log("Could not load MathJax..."));
const mathExtension = () => {
    return [
        {
            type: "lang",
            regex: /^¨D¨D(.*?)¨D¨D$/gms,
            replace: (match, content) => {
                const svg = shared.mj.tex2svg(content, { display: true });
                return shared.mj.startup.adaptor.outerHTML(svg);
            },
        },
    ];
};
const footnotesExtension = () => [
    {
        type: "lang",
        filter: (text) => text.replace(/^\[\^([\d\w]+)\]:\s*((\n+(\s{2,4}|\t).+)+)$/gm, (str, name, rawContent, _, padding) => {
            const content = shared.converter.makeHtml(rawContent.replace(new RegExp(`^${padding}`, "gm"), ""));
            return `<div class="footnote" id="footnote-${name}"><a href="#footnote-${name}"><sup>[${name}]</sup></a>:${content}</div>`;
        }),
    },
    {
        type: "lang",
        filter: (text) => text.replace(/^\[\^([\d\w]+)\]:( |\n)((.+\n)*.+)$/gm, (str, name, _, content) => `<small class="footnote" id="footnote-${name}"><a href="#footnote-${name}"><sup>[${name}]</sup></a>: ${content}</small>`),
    },
    {
        type: "lang",
        filter: (text) => text.replace(/\[\^([\d\w]+)\]/m, (str, name) => `<a href="#footnote-${name}"><sup>[${name}]</sup></a>`),
    },
];
Showdown.extension("footnotes", footnotesExtension);
Showdown.extension("math", mathExtension);
const defaultConfig = {
    outDir: "",
    rootDir: "",
    watch: false,
    include: [".*"],
    exclude: [],
    css: [],
    compilerOptions: {
        outputHTML: true,
    },
    serve: true,
    serverOptions: {
        port: 8080,
        host: "localhost",
        open: true,
    },
    resultModifier: {
        before: (x) => x,
        after: (x) => x,
    },
    checkAssets: (x) => {
        let type = mime.lookup(x);
        if (type) {
            if ([
                "image/png",
                "image/jpeg",
                "image/gif",
                "image/svg+xml",
            ].includes(type)) {
                return true;
            }
        }
    },
    generateMetadata(metadata) {
        let str = "";
        for (const key in metadata) {
            let value = metadata[key];
            if (key === "title") {
                str += `<title>${value}</title>`;
            }
            else if (key === "description") {
                str += `<meta name="description" content="${value}">`;
            }
            else if (key === "keywords") {
                str += `<meta name="keywords" content="${value}">`;
            }
            else if (key === "author") {
                str += `<meta name="author" content="${value}">`;
            }
            else if (key === "date") {
                str += `<meta name="date" content="${value}">`;
            }
            else if (key === "copyright") {
                str += `<meta name="copyright" content="${value}">`;
            }
            else if (key === "scripts") {
                for (const script of value) {
                    str += `<script src="${script}"></script>`;
                }
            }
            else if (key === "styles") {
                for (const style of value) {
                    str += `<link rel="stylesheet" href="${style}">`;
                }
            }
        }
        return str;
    },
    linkValidation: true,
    wrapper: function (head, body, metadata, source) {
        let str = `<!DOCTYPE html><html><head>${head}${this.generateMetadata(metadata)}</head><body>${body}</body></html>`;
        return str;
    },
};
const shared = {
    mj: undefined,
    ROOT: "",
    converter: new Showdown.Converter({
        extensions: ["math", "footnotes"],
        customizedHeaderId: true,
        ghCompatibleHeaderId: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tables: true,
        tasklists: true,
        emoji: true,
        metadata: true,
        moreStyling: true,
    }),
    env: env,
    config: defaultConfig
};
export { shared, testInclude, defaultConfig };

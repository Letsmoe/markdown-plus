import { marked } from "marked";
export default function labels(options) {
    return function (content) {
        return content.replace(/^\[([\w\d,]+)\]:(.*?(?:\n\n|$(?![\r\n])))/gms, (all, type, content) => {
            return `<div class="${type.split(",").join(" ")}">${marked.parse(content.split("\n").join("\n\n").trim())}</div>`;
        });
    };
}

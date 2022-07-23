import { marked } from "marked";
export default function (options) {
    return function (content) {
        return marked.parse(content);
    };
}

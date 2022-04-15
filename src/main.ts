import * as showdown from "showdown";
import * as fs from "fs";

export {InputStream} from "./input-stream.js";
export {TokenStream} from "./token-stream.js";
export {parse} from "./parser.js";

const converter = new showdown.Converter();

console.log(converter.makeHtml("# Hello, Markdown!"));

import { readParseFile } from './parse-file.js';
import { shared } from './shared.js';
import { Environment } from "../interpreter.js";
const env = new Environment(null);
env.set("print", (...args) => {
    process.stdout.write(args.join(" ") + "\n");
});
env.set("setDefaultCSS", (path) => {
    shared.config.css = path;
});
env.set("include", (filename) => {
    const content = readParseFile(filename, env);
    return content;
});
env.set("toc", (title) => {
    let list = "<ol>";
    let inLevel3 = false;
    env.__headings.forEach((heading) => {
        let link = `<li><a href="#${heading.id}">${heading.text}</a></li>`;
        if (heading.level == 3) {
            if (inLevel3) {
                list += link;
                return;
            }
            inLevel3 = true;
            list += `<ul>${link}`;
        }
        else if (heading.level == 2) {
            if (inLevel3) {
                list += "</ul>";
            }
            list += link;
            inLevel3 = false;
        }
    });
    list += "</ol>";
    return `<details><summary>${title}</summary>${list}</details>`;
});
export { env };

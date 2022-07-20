import { Environment } from "@gyro-lang/core";
export default function createEnvironment(config, content) {
    const env = new Environment(null);
    env.def("print", (...args) => {
        process.stdout.write(args.join(" ") + "\n");
    });
    env.def("center", (...args) => {
        const content = `<p align="center">${args.join("<br>")}</p>`;
        env.vars.__writeBuffer += content;
        return content;
    });
    env.def("__headings", []);
    env.def("toc", (title) => {
        let list = "<ol>";
        let inLevel3 = false;
        env.vars.__headings.forEach((heading) => {
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
    env.def("write", (...args) => {
        env.vars.__writeBuffer += args.join(" ");
        return args.join(" ");
    });
    return env;
}

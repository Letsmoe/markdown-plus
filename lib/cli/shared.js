import * as showdown from "showdown";
import { env } from "./interpreter-environment.js";
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
const shared = {
    ROOT: "",
    errors: 0,
    warnings: 0,
    // @ts-ignore
    converter: new showdown.default.Converter({
        customizedHeaderId: true,
        ghCompatibleHeaderId: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tables: true,
        tasklists: true,
        emoji: true,
        completeHTMLDocument: true,
        metadata: true,
        moreStyling: true,
    }),
    dependencies: [],
    env: env,
    config: {
        outDir: "",
        rootDir: "",
        watch: false,
        include: [".*"],
        exclude: [],
        css: "",
        compilerOptions: {
            outputHTML: true,
        },
        headerFile: ""
    }
};
export { shared, testInclude };

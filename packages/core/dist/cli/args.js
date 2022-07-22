import { colarg } from "colarg";
import { initCommand } from "./commands/index.js";
const parser = new colarg(process.argv.slice(2));
parser.addOption({
    name: "watch",
    alias: "w",
    description: "Watch the project for changes and automatically reload.",
    type: "boolean",
    defaults: false,
    required: false,
});
parser.addOption({
    name: "project",
    alias: "p",
    description: "A project file to use instead of using default settings.",
    type: "string",
    defaults: "",
    required: false,
});
parser.addOption({
    name: "markdown",
    alias: "m",
    description: "Whether or not to output markdown instead of HTML.",
    type: "boolean",
    defaults: false,
    required: false,
});
parser.addOption({
    name: "output",
    alias: "o",
    description: "The output file to write to.",
    type: "string",
    defaults: "",
    required: false,
});
parser.addCommand({
    name: "init",
    description: "Initializes a folder containing default configuration files for running 'mdpc' right off the bet.",
    args: [{
            name: "force",
            alias: "f",
            description: "Ignore everything and just do it!",
            type: "boolean",
            default: false,
            required: false
        }, {
            name: "ignore",
            alias: "i",
            description: "Create a .gitignore file configured for a MarkdownPlus documentation.",
            type: "boolean",
            default: false,
            required: false
        }, {
            name: "title",
            alias: "t",
            description: "Specify the title of your project, will be changed in all files.",
            type: "string",
            default: ":title",
            required: false
        }, {
            name: "author",
            alias: "a",
            description: "Specify the author of your project, will be changed in all files.",
            type: "string",
            default: ":author",
            required: false
        }]
}, initCommand);
parser.defineUsage("Usage: mdpc [-p <project>] [-w <true|false>]");
parser.enableHelp();
const args = parser.getArgs();
export default args;

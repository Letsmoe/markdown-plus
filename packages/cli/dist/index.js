#!/usr/bin/env node
import { colarg } from "colarg";
import { Context } from "./shared.js";
import buildCommand from "./commands/BuildCommand.js";
const parser = new colarg(process.argv.slice(2));
parser.addOption({
    name: "project",
    alias: "p",
    required: false,
    description: "The project file to use.",
    type: "string",
    defaults: ""
});
/**
 * Captures the context, displays the current version of docks and exits.
 */
parser.addOption({
    name: "version",
    alias: "v",
    required: false,
    description: "Display the version docks and exit.",
    callback: () => {
        console.log("You're rocking version " + Context.Version);
        process.exit(0);
    }
});
parser.addCommand({
    name: "build",
    description: "Builds the documentation based upon the SUMMARY.md file at the root of the folder pointed to.",
    args: [{
            name: "serve",
            alias: "s",
            required: false,
            description: "Whether to start a local development server.",
            type: "boolean",
            defaults: false
        }, {
            name: "watch",
            alias: "w",
            required: false,
            description: "Whether to watch the root directory of the project.",
            type: "boolean",
            defaults: false
        }]
}, buildCommand);
parser.enableHelp();
const args = parser.getArgs();

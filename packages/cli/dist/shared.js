import * as fs from "fs";
import path from "path";
import __dirname from "./__dirname.js";
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json")).toString());
let startTime = 0;
export const Context = {
    Version: pkg.version,
    Package: pkg,
    getDate: () => {
        let date = new Date();
        const pad = (x) => x.toString().padStart(2, "0");
        return `[${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}]`;
    },
    log: function (content) {
        console.log(this.getDate(), content);
    },
    PrintHeaders() {
        this.Headers.forEach((header) => {
            this.log(header);
        });
    },
    Headers: [],
    Clear() {
        console.clear();
    },
    Measure() {
        startTime = Date.now();
        return () => {
            return Date.now() - startTime;
        };
    }
};

import { COLORS, color } from "./cargs.js";
const issueWarning = (message) => {
    process.stdout.write(color(`[WARN]	${message}\n`, COLORS.YELLOW));
};
const issueError = (message, exit = false) => {
    process.stdout.write(color(`[ERROR]	${message}\n`, COLORS.RED));
    if (exit) {
        process.exit(1);
    }
};
export { issueWarning, issueError };

const issueWarning = (message) => {
    process.stdout.write(`[WARN]	${message}\n`);
};
const issueError = (message, exit = false) => {
    process.stdout.write(`[ERROR]	${message}\n`);
    if (exit) {
        process.exit(1);
    }
};
export { issueWarning, issueError };

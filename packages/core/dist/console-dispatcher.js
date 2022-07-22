const warn = (message) => {
    process.stdout.write(`[WARN]	${message}\n`);
};
const error = (message, exit = false) => {
    process.stdout.write(`[ERROR]	${message}\n`);
    if (exit) {
        process.exit(1);
    }
};
export { warn, error };

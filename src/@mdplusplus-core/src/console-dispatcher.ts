
const warn = (message: string) => {
	process.stdout.write(`[WARN]	${message}\n`);
};

const error = (message: string, exit: boolean = false) => {
	process.stdout.write(`[ERROR]	${message}\n`);
	if (exit) {
		process.exit(1);
	}
}

export {warn, error}

const issueWarning = (message: string) => {
	process.stdout.write(`[WARN]	${message}\n`);
};

const issueError = (message: string, exit: boolean = false) => {
	process.stdout.write(`[ERROR]	${message}\n`);
	if (exit) {
		process.exit(1);
	}
}

export {issueWarning, issueError}
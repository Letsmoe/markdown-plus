import { COLORS, color } from "colarg";

const issueWarning = (message: string) => {
	process.stdout.write(color(`[WARN]	${message}\n`, COLORS.YELLOW));
};

const issueError = (message: string, exit: boolean = false) => {
	process.stdout.write(color(`[ERROR]	${message}\n`, COLORS.RED));
	if (exit) {
		process.exit(1);
	}
}

export {issueWarning, issueError}
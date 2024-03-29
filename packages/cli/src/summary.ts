import * as fs from 'fs';
import * as path from 'path';

function loadSummaryFile(root: string) {
	if (!path.isAbsolute(root)) {
		root = path.join(process.cwd(), root);
	}
	let summaryPath = path.join(root, ".docks", "SUMMARY.md");
	if (fs.existsSync(summaryPath)) {
		return fs.readFileSync(summaryPath, 'utf-8');
	}
	return null;
}

export { loadSummaryFile }
import * as fs from 'fs';
import * as path from 'path';
function loadSummaryFile(root) {
    if (!path.isAbsolute(root)) {
        root = path.join(process.cwd(), root);
    }
    let summaryPath = path.join(root, 'SUMMARY.md');
    if (fs.existsSync(summaryPath)) {
        return fs.readFileSync(summaryPath, 'utf-8');
    }
    return null;
}
export { loadSummaryFile };

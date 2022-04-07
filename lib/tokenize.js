function tokenize(src, sourceMapping = false) {
    const tokens = [];
    const chars = src.split("");
    let buffer = "";
    let line = 0;
    let col = 0;
    // Containers for token values which are set at the start of buffer creation
    let posStart = 0;
    let lineStart = 0;
    let colStart = 0;
    /**
     * Writes to the buffer and sets any relavent positional context that may be needed
     */
    const writeBuffer = (text, pos, colNum, lineNum) => {
        if (buffer.length === 0) {
            buffer = text;
            posStart = pos;
            colStart = colNum;
            lineStart = lineNum;
        }
        else {
            buffer += text;
        }
        col++;
    };
    // Writes characters in the buffer as a token, takes the positions, and clears the buffer
    const flush = () => {
        if (buffer.length) {
            const colEnd = colStart + buffer.length - 1;
            const endPos = posStart + buffer.length - 1;
            tokens.push(sourceMapping
                ? {
                    value: buffer,
                    line: lineStart,
                    colStart,
                    colEnd,
                    start: posStart,
                    end: endPos,
                }
                : buffer);
        }
        buffer = "";
    };
    let arrLines = src.split("\n");
    for (let i = 0; i < chars.length; ++i) {
        const char = chars[i];
        const nextChar = chars[i + 1];
        if (char === ";") {
            // Found a comment, can only be terminated with start of next line, skip there
            i += arrLines[line].length - col;
            line++;
            col = 0;
            continue;
        }
        if (char === "\n") {
            line += 1;
            col = 0;
            continue;
        }
        // Support the ability to escape symbols
        if (char === "\\") {
            writeBuffer(char + nextChar, i, col, line);
            i += 1; // skip lexing the next character altogether
            continue;
        }
        // Tokenize grouping symbols
        if (char === "{" || char === "}" || char === '"') {
            flush();
            writeBuffer(char, i, col, line);
            flush();
            continue;
        }
        // Build up tokens
        if (char.match(/\S/)) {
            writeBuffer(char, i, col, line);
        }
        else {
            flush();
            col++; // account for whitespace
        }
    }
    // Tokenize anything remaining in the buffer
    flush();
    return tokens;
}
export { tokenize };

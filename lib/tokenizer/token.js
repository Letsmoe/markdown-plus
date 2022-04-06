import { TOKEN_TYPES } from "../types.js";
class Token {
    constructor(value) {
        this.value = value;
        this.type = this.matchTokenType();
    }
    /**
     * Match the value of the current token to a specific token type for parsing later on.
     * @date 4/3/2022 - 11:52:14 PM
     */
    matchTokenType() {
        switch (this.value) {
            case " ": return TOKEN_TYPES.WHITESPACE;
            case "\\": return TOKEN_TYPES.BACKSLASH;
            case "{": return TOKEN_TYPES.OPEN_CURLY;
            case "}": return TOKEN_TYPES.CLOSE_CURLY;
            case ((this.value.toLowerCase() != this.value.toUpperCase()) ? this.value : null): return TOKEN_TYPES.LETTER;
            case (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].indexOf(this.value) > -1 ? this.value : NaN): return TOKEN_TYPES.DIGIT;
            case "[": return TOKEN_TYPES.OPEN_BRACKET;
            case "]": return TOKEN_TYPES.CLOSE_BRACKET;
            case (["\\", "`", "*", "_", "(", ")", "#", "+", "-", "!"].indexOf(this.value) > -1 ? this.value : NaN): return TOKEN_TYPES.SPECIAL;
            case "\n": return TOKEN_TYPES.NEWLINE;
            case "\t": return TOKEN_TYPES.TAB;
            case ".": return TOKEN_TYPES.POINT;
        }
    }
}
export { Token };

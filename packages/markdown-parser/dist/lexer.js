import { TokenType } from "./token.type.js";
const tokenMap = {
    "[": TokenType.LEFT_BRACE,
    "]": TokenType.RIGHT_BRACE,
    "(": TokenType.LEFT_BRACE,
    ")": TokenType.RIGHT_BRACE,
    "#": TokenType.HASH,
    "-": TokenType.DASH,
    "`": TokenType.APOSTROPHE
};
function Lexer(reader) {
    let i = 0;
    const tokens = [];
    run();
    function run() {
        while (!reader.isEOF()) {
            scanToken();
        }
        addToken(TokenType.EOF);
    }
    function scanToken() {
        const c = reader.consume();
        if (c === " ") {
            if (reader.peek() === " ") {
                addToken(TokenType.INDENT);
                reader.consume();
            }
        }
        else if (c === "\n") {
            reader.consume();
            addToken(TokenType.NEWLINE);
        }
        else if (tokenMap.hasOwnProperty(c)) {
            addToken(tokenMap[c]);
        }
        else {
            stringLiteral(c);
        }
    }
    function stringLiteral(c) {
        let text = c;
        let unClosedParens = 0;
        let unClosedBraces = 0;
        while (reader.peek() !== "\n" && !reader.isEOF()) {
            const nth = reader.peek();
            if (nth === "(") {
                unClosedParens += 1;
            }
            else if (nth === ")" && unClosedParens === 0) {
                break;
            }
            else if (nth === ")") {
                unClosedParens -= 1;
            }
            else if (nth === "[") {
                unClosedBraces += 1;
            }
            else if (nth === "]" && unClosedBraces === 0) {
                break;
            }
            else if (nth === "]") {
                unClosedBraces -= 1;
            }
            else if (nth === "`") {
                break;
            }
            // All BRACE and PARENS must be closed
            text += reader.consume();
        }
        addToken(TokenType.STRING, text);
    }
    function addToken(type, lexeme = null) {
        tokens.push({ type, lexeme });
    }
    function peek(nth = 0) {
        return tokens[i + nth].type;
    }
    function consume(nth = 0) {
        const t = tokens[i + nth];
        i = i + nth + 1;
        return t;
    }
    function isEOF() {
        return tokens.length - 1 < i;
    }
    function printTokens() {
        tokens.map((k) => {
            console.log(`type: ${TokenType[k.type]} lexeme: ${k.lexeme}`);
        });
    }
    function printTokenType() {
        tokens.map((k) => {
            console.log(`${TokenType[k.type]}`);
        });
    }
    return Object.freeze({ peek, consume, isEOF, printTokens, printTokenType });
}
export { Lexer };

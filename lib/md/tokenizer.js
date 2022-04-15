import { TokenTypes } from "./types.js";
class Tokenizer {
    constructor(stream) {
        this.stream = stream;
        this.tokens = [];
        while (this.peek()) {
            this.next();
        }
        console.log(this.tokens);
    }
    readWhile(predicate) {
        let str = "";
        while (!this.stream.eof() && predicate(this.stream.peek())) {
            str += this.stream.next();
        }
        return str;
    }
    addToken(token) {
        this.tokens.push(token);
        return token;
    }
    read_next() {
        if (this.stream.eof())
            return null;
        let ch = this.stream.peek();
        if (isIndent(ch))
            return this.addToken({ type: TokenTypes.INDENT, value: this.readWhile(isIndent) });
        if (ch === "[")
            return this.addToken({ type: TokenTypes.OPEN_BRACKET, value: this.stream.next() });
        if (ch === "]")
            return this.addToken({ type: TokenTypes.CLOSE_BRACKET, value: this.stream.next() });
        if (ch === "(")
            return this.addToken({ type: TokenTypes.OPEN_PAREN, value: this.stream.next() });
        if (ch === ")")
            return this.addToken({ type: TokenTypes.CLOSE_PAREN, value: this.stream.next() });
        if (ch === "-")
            return this.addToken({ type: TokenTypes.DASH, value: this.readWhile((x) => x == "-") });
        if (ch === "*")
            return this.addToken({ type: TokenTypes.ASTERISK, value: this.stream.next() });
        if (ch === "_")
            return this.addToken({ type: TokenTypes.UNDERSCORE, value: this.stream.next() });
        if (ch === ">")
            return this.addToken({ type: TokenTypes.BLOCKQUOTE, value: this.readWhile((x) => x === ">") });
        if (ch === "`")
            return this.addToken({ type: TokenTypes.BACKTICK, value: this.stream.next() });
        ;
        if (ch === "#")
            return this.addToken({ type: TokenTypes.HASH, value: this.readWhile((x) => x == "#") });
        if (ch === "\n")
            return this.addToken({ type: TokenTypes.NEWLINE, value: this.stream.next() });
        if (ch === "|")
            return this.addToken({ type: TokenTypes.PIPE, value: this.stream.next() });
        if (ch === ":")
            return this.addToken({ type: TokenTypes.COLON, value: this.stream.next() });
        if (ch === "%")
            return this.addToken({ type: TokenTypes.PERCENT, value: this.stream.next() });
        if (ch === "{")
            return this.addToken({ type: TokenTypes.OPEN_CURLY, value: this.stream.next() });
        if (ch === "}")
            return this.addToken({ type: TokenTypes.CLOSE_CURLY, value: this.stream.next() });
        if (ch === "!")
            return this.addToken({ type: TokenTypes.EXCLAMATION, value: this.stream.next() });
        if (isWhitespace(ch))
            return this.addToken({ type: TokenTypes.WHITESPACE, value: this.readWhile(isWhitespace) });
        if (isCharacter(ch))
            return this.addToken({ type: TokenTypes.TEXT, value: this.readWhile(isCharacter) });
        this.stream.croak("Can't handle character: " + ch);
    }
    peek() {
        return this.current || (this.current = this.read_next());
    }
    next() {
        var tok = this.current;
        this.current = null;
        return tok || this.read_next();
    }
    eof() {
        return this.peek() == null;
    }
    croak(msg) {
        this.stream.croak(msg);
    }
}
const isIndent = (ch) => ["\t", "    "].indexOf(ch) >= 0;
const isCharacter = (ch) => /./.test(ch) && ["#", ">", "-", "*", "_", "[", "]", "{", "}", "(", ")", "`", "!"].indexOf(ch) == -1;
const isWhitespace = (ch) => " \t".indexOf(ch) >= 0;
export { Tokenizer };

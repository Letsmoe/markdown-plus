var TokenType;
(function (TokenType) {
    TokenType[TokenType["UNDERSCORE"] = 0] = "UNDERSCORE";
    TokenType[TokenType["ASTERISK"] = 1] = "ASTERISK";
    TokenType[TokenType["L_BRACKET"] = 2] = "L_BRACKET";
    TokenType[TokenType["R_BRACKET"] = 3] = "R_BRACKET";
    TokenType[TokenType["R_PAREN"] = 4] = "R_PAREN";
    TokenType[TokenType["L_PAREN"] = 5] = "L_PAREN";
    TokenType[TokenType["EXCLAMATION"] = 6] = "EXCLAMATION";
    TokenType[TokenType["BACKTICK"] = 7] = "BACKTICK";
    TokenType[TokenType["HASH"] = 8] = "HASH";
    TokenType[TokenType["NEWLINE"] = 9] = "NEWLINE";
    TokenType[TokenType["WORD"] = 10] = "WORD";
    TokenType[TokenType["TILDE"] = 11] = "TILDE";
    TokenType[TokenType["SPACE"] = 12] = "SPACE";
    TokenType[TokenType["GREATER"] = 13] = "GREATER";
})(TokenType || (TokenType = {}));
const tokenMap = {
    "_": TokenType.UNDERSCORE,
    "*": TokenType.ASTERISK,
    "(": TokenType.L_PAREN,
    ")": TokenType.R_PAREN,
    "[": TokenType.L_BRACKET,
    "]": TokenType.R_BRACKET,
    "!": TokenType.EXCLAMATION,
    "`": TokenType.BACKTICK,
    "#": TokenType.HASH,
    "\n": TokenType.NEWLINE,
    "~": TokenType.TILDE,
    " ": TokenType.SPACE,
    ">": TokenType.GREATER
};
function tokenize(text) {
    const tokens = [];
    const chars = text.trim().split("");
    let curr = "";
    let line = 0;
    let column = 0;
    let escaped = false;
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        if (char == "\n") {
            line++;
            column = 0;
        }
        if (tokenMap.hasOwnProperty(char) && !escaped) {
            if (curr.length > 0) {
                let token = new Token(curr, TokenType.WORD);
                token.setLocation(line, column - curr.length, column);
                tokens.push(token);
                curr = "";
            }
            let token = new Token(char, tokenMap[char]);
            token.setLocation(line, column, column);
            tokens.push(token);
        }
        else if (char == "\\") {
            escaped = true;
        }
        else {
            curr += char;
            escaped = false;
        }
        column++;
    }
    if (curr.length > 0) {
        let token = new Token(curr, TokenType.WORD);
        token.setLocation(line, column - curr.length, column);
        tokens.push(token);
    }
    return tokens;
}
class MarkdownParser {
    constructor() {
        this.tokens = [];
        this.cursor = -1;
        this.content = "";
    }
    peek(by = 1) {
        if ((this.cursor + by) <= (this.tokens.length - 1)) {
            return this.tokens[this.cursor + by];
        }
        return null;
    }
    next(by = 1) {
        if ((this.cursor + by) < this.tokens.length) {
            this.cursor += by;
            return this.tokens[this.cursor];
        }
        return null;
    }
    parse(tokens) {
        this.tokens = tokens;
        this.cursor = -1;
        while (this.peek()) {
            this.content += this.parseAtom();
        }
        return this.content;
    }
    isType(type, offset = 1) {
        let tok = this.peek(offset);
        return tok && tok.type === type;
    }
    parseWhile(predicate) {
        let content = "";
        let token, nextToken;
        while ((token = this.peek()) && predicate(token)) {
            content += this.parseAtom();
        }
        return content;
    }
    parseText() {
        let tokens = [];
        let token;
        while ((token = this.peek()) && (token.type === TokenType.WORD) || (token.type === TokenType.SPACE)) {
            tokens.push(this.next());
        }
        return tokens.map(x => x.value).join("");
    }
    parseBold() {
        this.next(2);
        let content = this.parseWhile((x) => {
            return (x.type !== TokenType.ASTERISK) || (this.peek(2).type !== TokenType.ASTERISK);
        });
        this.next(2);
        return `<strong>${content}</strong>`;
    }
    parseStrikethrough() {
        this.next();
        let content = this.parseWhile(x => x.type !== TokenType.TILDE);
        ;
        this.next();
        return `<s>${content}</s>`;
    }
    parseItalic() {
        this.next();
        let content = this.parseWhile(x => x.type !== TokenType.ASTERISK);
        ;
        this.next();
        return `<em>${content}</em>`;
    }
    readWhile(predicate) {
        let tokens = [];
        let token;
        while ((token = this.peek()) && predicate(token)) {
            tokens.push(this.next());
        }
        return tokens.map(x => x.value).join("");
    }
    skipWhitespace() {
        this.readWhile(x => x.type === TokenType.SPACE);
    }
    parseHeading() {
        let hashes = this.readWhile(x => x.type === TokenType.HASH);
        this.skipWhitespace();
        let content = this.parseWhile(x => x.type !== TokenType.NEWLINE);
        let level = hashes.length;
        return `<h${level}>${content}</h${level}>`;
    }
    parseBlockquote() {
        this.next();
        this.skipWhitespace();
        let content = this.parseWhile(x => x.type !== TokenType.NEWLINE);
        return `<blockquote>${content}</blockquote>`;
    }
    nextIs(type) {
        let tok = this.peek(2);
        return tok && tok.type === type;
    }
    parseMultiLineCode() {
        this.next(3);
        let language = (this.peek().type === TokenType.WORD) ? this.next() : "";
        let content = this.readWhile(x => {
            return x.type !== TokenType.BACKTICK || this.peek(2).type !== TokenType.BACKTICK || this.peek(3).type !== TokenType.BACKTICK;
        });
        return `<pre><code class="language-${language}">${content}</code></pre>`;
    }
    parseInlineCode() {
        this.next();
        let content = this.readWhile(x => x.type !== TokenType.BACKTICK);
        this.next();
        return `<code>${content}</code>`;
    }
    parseAtom() {
        const nextWhitespace = this.nextIs(TokenType.SPACE);
        const isFirst = this.peek().column_start === 0;
        if (this.isType(TokenType.ASTERISK) && this.isType(TokenType.ASTERISK, 2)) {
            return this.parseBold();
        }
        else if (this.isType(TokenType.ASTERISK) && !nextWhitespace) {
            // Italic
            return this.parseItalic();
        }
        else if (this.isType(TokenType.TILDE) && !nextWhitespace) {
            return this.parseStrikethrough();
        }
        else if (this.isType(TokenType.HASH) && isFirst && nextWhitespace) {
            return this.parseHeading();
        }
        else if (this.isType(TokenType.GREATER) && isFirst && nextWhitespace) {
            return this.parseBlockquote();
        }
        else if (isFirst && this.isType(TokenType.BACKTICK) && this.peek(2).type === TokenType.BACKTICK && this.peek(3).type === TokenType.BACKTICK) {
            // Multi line code block.
            return this.parseMultiLineCode();
        }
        else if (this.isType(TokenType.BACKTICK)) {
            return this.parseInlineCode();
        }
        else {
            return this.parseText();
        }
    }
}
class Token {
    constructor(value, type) {
        this.value = value;
        this.type = type;
    }
    setLocation(line, column_start, column_end) {
        this.line = line;
        this.column_start = column_start;
        this.column_end = column_end;
    }
    get length() {
        return this.value.length;
    }
}
const parser = new MarkdownParser();
const tokens = tokenize(`**\\*Nice\\***`);
let code2 = `
## Heading 2

- List
	- Indented List

Text *italic* and **bold**, even ~strikethrough~.

Sometimes, even [Links](https://example.com) work.

And ![Images](https://example.com) are supported as well.

Inline \`code blocks\` andgiant code.trim()

\`\`\`javascript
console.log("nice");
\`\`\`
`;
console.log(parser.parse(tokens));

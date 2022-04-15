import { TokenTypes } from "./types.js";
class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.index = 0;
        this.lineStart = false;
        let code = "<head></head><body>";
        while (this.peek()) {
            let value = this.doNext();
            if (value) {
                code += value;
            }
        }
        code += "</body>";
        console.log(code);
    }
    doHeading() {
        let token = this.next();
        let level = token.value.length;
        this.skipWhitespace();
        let text = this.readWhile((x) => x.type !== TokenTypes.NEWLINE);
        return `<h${level}>${text}</h${level}>`;
    }
    skipWhitespace() {
        while (this.peek() && this.peek().type === TokenTypes.WHITESPACE) {
            this.next();
        }
    }
    doText() {
        let text = this.next().value;
        return text;
    }
    doBlockquote() {
        this.next();
        this.skipWhitespace();
        let text = this.readWhile((x) => x.type !== TokenTypes.NEWLINE);
        return `<blockquote>${text}</blockquote>`;
    }
    doList() {
        this.next();
        this.skipWhitespace();
        let text = this.readWhileInterpolate((x) => x.type !== TokenTypes.NEWLINE);
        return `<li>${text}</li>`;
    }
    doHorizontal() {
        this.next();
        return `<hr>`;
    }
    doLink() {
        this.next();
        this.skipWhitespace();
        let text = this.readWhile((x) => x.type !== TokenTypes.CLOSE_BRACKET);
        this.next(2); // Skip the closing bracket and the opening paren
        let link = this.readWhile((x) => x.type !== TokenTypes.CLOSE_PAREN);
        this.next();
        return `<a href="${link}">${text}</a>`;
    }
    doImage() {
        this.next(2);
        this.skipWhitespace();
        let alt = this.readWhile((x) => x.type !== TokenTypes.CLOSE_BRACKET);
        this.next(2); // Skip the closing bracket and the opening paren
        let link = this.readWhile((x) => x.type !== TokenTypes.CLOSE_PAREN);
        this.next();
        return `<img src="${link}" alt="${alt}">`;
    }
    readWhile(predicate) {
        let text = "";
        while (this.peek() && predicate(this.peek(), this.peek(1))) {
            text += this.next().value;
        }
        return text;
    }
    readWhileInterpolate(predicate) {
        let text = "";
        while (this.peek() && predicate(this.peek(), this.peek(1))) {
            text += this.doNext();
        }
        return text;
    }
    doBoldOrEmphasize() {
        this.next();
        this.skipWhitespace();
        let type = "em";
        if (this.peek().type === TokenTypes.ASTERISK) {
            type = "strong";
            this.next();
        }
        let text = this.readWhile((x) => x.type !== TokenTypes.ASTERISK);
        this.skipType(TokenTypes.ASTERISK);
        return `<${type}>${text}</${type}>`;
    }
    skipType(type) {
        while (this.peek() && this.peek().type === type) {
            this.next();
        }
    }
    doEmbedCode() {
        this.next(2);
        let code = this.readWhile((x, next) => x.type !== TokenTypes.PERCENT && next.type !== TokenTypes.CLOSE_CURLY);
        this.next(2);
        return code;
    }
    doNext() {
        let token = this.peek();
        if (token.type === TokenTypes.NEWLINE) {
            this.next();
            this.lineStart = true;
            return;
        }
        if (token.type === TokenTypes.TEXT) {
            this.lineStart = false;
            return this.doText();
        }
        else if (token.type === TokenTypes.ASTERISK) {
            this.lineStart = false;
            return this.doBoldOrEmphasize();
        }
        else if (token.type === TokenTypes.OPEN_BRACKET) {
            this.lineStart = false;
            return this.doLink();
        }
        else if (token.type === TokenTypes.EXCLAMATION && this.peek(1).type === TokenTypes.OPEN_BRACKET) {
            this.lineStart = false;
            return this.doImage();
        }
        if (this.lineStart === true) {
            if (token.type === TokenTypes.HASH) {
                return this.doHeading();
            }
            else if (token.type === TokenTypes.BLOCKQUOTE) {
                return this.doBlockquote();
            }
            else if (token.type === TokenTypes.DASH) {
                if (token.value.length > 1) {
                    // Not a list but a divider
                    return this.doHorizontal();
                }
                else {
                    return this.doList();
                }
            }
            else if (token.type === TokenTypes.OPEN_CURLY && this.peek(1).type === TokenTypes.PERCENT) {
                return this.doEmbedCode();
            }
        }
        console.warn("Invalid token encountered: " + JSON.stringify(token));
        return this.next().value;
    }
    peek(offset = 0) {
        if (this.index + offset >= this.tokens.length) {
            return null;
        }
        return this.tokens[this.index + offset];
    }
    next(len = 1) {
        let token;
        for (let i = 0; i < len; i++) {
            if (this.peek()) {
                token = this.tokens[this.index];
                this.index++;
            }
            else {
                return null;
            }
        }
        return token;
    }
}
export { Parser };

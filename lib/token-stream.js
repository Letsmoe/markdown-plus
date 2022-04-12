class TokenStream {
    constructor(stream) {
        this.stream = stream;
        this.KEYWORDS = [
            "if",
            "else",
            "while",
            "let",
            "const",
            "func",
            "then",
            "for",
        ];
    }
    isKeyword(x) {
        return this.KEYWORDS.indexOf(x) >= 0;
    }
    isDigit(ch) {
        return /[0-9]/i.test(ch);
    }
    isIdentifierStart(ch) {
        return /[a-zλ_]/i.test(ch);
    }
    is_id(ch) {
        return (this.isIdentifierStart(ch) || "?!-<>=0123456789".indexOf(ch) >= 0);
    }
    is_op_char(ch) {
        return (["+", "-", "*", "/", "%", "=", "&", "|", "<", ">", "!"].indexOf(ch) >= 0);
    }
    is_punc(ch) {
        return ",;(){}[]".indexOf(ch) >= 0;
    }
    is_whitespace(ch) {
        return " \t\n".indexOf(ch) >= 0;
    }
    readWhile(predicate) {
        var str = "";
        while (!this.stream.eof() && predicate(this.stream.peek()))
            str += this.stream.next();
        return str;
    }
    read_number() {
        var has_dot = false;
        var number = this.readWhile((ch) => {
            if (ch == ".") {
                if (has_dot)
                    return false;
                has_dot = true;
                return true;
            }
            return this.isDigit(ch);
        });
        return { type: "number", value: parseFloat(number) };
    }
    readIdentifier() {
        var id = this.readWhile(this.is_id.bind(this));
        return {
            type: this.isKeyword(id) ? "keyword" : "identifier",
            value: id,
        };
    }
    read_escaped(end) {
        var escaped = false, str = "";
        this.stream.next();
        while (!this.stream.eof()) {
            var ch = this.stream.next();
            if (escaped) {
                str += ch;
                escaped = false;
            }
            else if (ch == "\\") {
                escaped = true;
            }
            else if (ch == end) {
                break;
            }
            else {
                str += ch;
            }
        }
        return str;
    }
    read_string() {
        return { type: "string", value: this.read_escaped('"') };
    }
    skipComment() {
        this.readWhile(function (ch) {
            return ch != "\n";
        });
        this.stream.next();
    }
    read_next() {
        this.readWhile(this.is_whitespace);
        if (this.stream.eof())
            return null;
        var ch = this.stream.peek();
        if (ch == "#") {
            this.skipComment();
            return this.read_next();
        }
        if (ch == '"')
            return this.read_string();
        if (this.isDigit(ch))
            return this.read_number();
        if (this.isIdentifierStart(ch))
            return this.readIdentifier();
        if (this.is_punc(ch))
            return {
                type: "punctuation",
                value: this.stream.next(),
            };
        if (this.is_op_char(ch))
            return {
                type: "operator",
                value: this.readWhile(this.is_op_char),
            };
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
export { TokenStream };

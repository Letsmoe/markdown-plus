class InputStream {
    constructor(input) {
        this.input = input;
        this.pos = 0;
        this.line = 1;
        this.col = 0;
    }
    next() {
        var ch = this.input.charAt(this.pos++);
        if (ch == "\n") {
            this.line++;
            this.col = 0;
        }
        else
            this.col++;
        return ch;
    }
    peek(offset = 0) {
        return this.input.charAt(this.pos + offset);
    }
    eof() {
        return this.peek() == "";
    }
    reset() {
        this.pos = 0;
        this.line = 0;
        this.col = 0;
    }
    croak(msg) {
        console.error(msg + " (" + this.line + ":" + this.col + ")");
    }
}
export { InputStream };

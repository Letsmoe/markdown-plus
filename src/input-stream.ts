class InputStream {
	private pos: number = 0;
	private line: number = 1;
	private col: number = 0;
	constructor(private input: string) {}
	next() {
		var ch = this.input.charAt(this.pos++);
		if (ch == "\n") {
			this.line++;
			this.col = 0;
		} else this.col++;
		return ch;
	}
	peek() {
		return this.input.charAt(this.pos);
	}
	eof() {
		return this.peek() == "";
	}
	croak(msg: string) {
		throw new Error(msg + " (" + this.line + ":" + this.col + ")");
	}
}

export { InputStream };

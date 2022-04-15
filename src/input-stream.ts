class InputStream {
	public pos: number = 0;
	public line: number = 1;
	public col: number = 0;
	constructor(private input: string) {}
	next() {
		var ch = this.input.charAt(this.pos++);
		if (ch == "\n") {
			this.line++;
			this.col = 0;
		} else this.col++;
		return ch;
	}
	peek(offset : number = 0) {
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
	croak(msg: string) {
		console.error(msg + " (" + this.line + ":" + this.col + ")");
	}
}

export { InputStream };

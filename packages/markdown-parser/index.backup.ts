enum TokenType {
	UNDERSCORE,
	ASTERISK,
	L_BRACKET,
	R_BRACKET,
	R_PAREN,
	L_PAREN,
	EXCLAMATION,
	BACKTICK,
	HASH,
	NEWLINE,
	WORD,
	TILDE,
	SPACE,
	GREATER,
	DASH,
	EQUAL,
	CARET,
	PIPE
}

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
	">": TokenType.GREATER,
	"-": TokenType.DASH,
	"=": TokenType.EQUAL,
	"^": TokenType.CARET,
	"|": TokenType.PIPE
}

function tokenize(text: string) {
	const tokens: Token[] = [];
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
				token.setLocation(line, column - curr.length, column)
				tokens.push(token)
				curr = "";
			}
			let token = new Token(char, tokenMap[char]);
			token.setLocation(line, column, column)
			tokens.push(token)
		} else if (char == "\\") {
			escaped = true;
		} else {
			curr += char;
			escaped = false;
		}
		column++;
	}
	if (curr.length > 0) {
		let token = new Token(curr, TokenType.WORD);
		token.setLocation(line, column - curr.length, column)
		tokens.push(token)
	}

	return tokens
}

class MarkdownParser {
	private tokens: Token[] = [];
	private cursor: number = -1;
	private content: string = "";
	constructor() {

	}

	private peek(by: number = 1) {
		if ((this.cursor + by) <= (this.tokens.length - 1)) {
			return this.tokens[this.cursor + by];
		}
		return null;
	}

	private next(by: number = 1) {
		if ((this.cursor + by) < this.tokens.length) {
			this.cursor += by;
			return this.tokens[this.cursor]
		}
		return null;
	}

	public parse(tokens: Token[]) {
		this.tokens = tokens;
		this.cursor = -1;
		while(this.peek()) {
			this.content += this.parseAtom();
		}
		return this.content;
	}

	private isType(type: TokenType, offset: number = 1): boolean {
		let tok = this.peek(offset);
		return tok && tok.type === type;
	}

	private parseWhile(predicate: (token: Token) => boolean) {
		let content = "";
		let token: Token, nextToken: Token;
		while((token = this.peek()) && predicate(token)) {
			content += this.parseAtom();
		}
		return content;
	}

	private parseText() {
		let tokens = []
		let token: Token;
		while((token = this.peek()) && ((token.type === TokenType.WORD) || (token.type === TokenType.SPACE))) {
			tokens.push(this.next())
		}
		return tokens.map(x => x.value).join("")
	}

	private parseBold() {
		this.next(2);
		let content = this.parseWhile((x) => {
			return (x.type !== TokenType.ASTERISK) || (this.peek(2).type !== TokenType.ASTERISK)
		});
		this.next(2)
		return `<strong>${content}</strong>`;
	}

	private parseStrikethrough() {
		this.next(2)
		let content = this.parseWhile(x => x.type !== TokenType.TILDE);;
		this.next(2)
		return `<s>${content}</s>`
	}

	private parseItalic() {
		this.next()
		let content = this.parseWhile(x => x.type !== TokenType.ASTERISK);;
		this.next()
		return `<em>${content}</em>`
	}

	private readWhile(predicate: (x: Token) => boolean) {
		let tokens = [];
		let token: Token;
		while((token = this.peek()) && predicate(token)) {
			tokens.push(this.next());
		}
		return tokens.map(x => x.value).join("");
	}

	private skipWhitespace() {
		this.readWhile(x => x.type === TokenType.SPACE)
	}

	private parseHeading() {
		let hashes = this.readWhile(x => x.type === TokenType.HASH);
		this.skipWhitespace()
		let content = this.parseWhile(x => x.type !== TokenType.NEWLINE);
		let level = hashes.length
		return `<h${level}>${content}</h${level}>`
	}

	private parseBlockquote() {
		this.next();
		this.skipWhitespace()
		let content = this.parseWhile(x => x.type !== TokenType.NEWLINE);
		return `<blockquote>${content}</blockquote>`
	}

	private nextIs(type: TokenType) {
		let tok = this.peek(2);
		return tok && tok.type === type;
	}

	private parseMultiLineCode() {
		this.next(3);
		let language = (this.peek().type === TokenType.WORD) ? this.next() : "";
		let content = this.readWhile(x => {
			return x.type !== TokenType.BACKTICK || this.peek(2).type !== TokenType.BACKTICK || this.peek(3).type !== TokenType.BACKTICK
		})
		return `<pre><code class="language-${language}">${content}</code></pre>`
	}

	private parseInlineCode() {
		this.next()
		let content = this.readWhile(x => x.type !== TokenType.BACKTICK);
		this.next()
		return `<code>${content}</code>`
	}

	private parseHorizontalRule() {
		this.next(3);
		return "<hr>"
	}

	private parseHighlight() {
		this.next(2);
		let content = this.parseWhile(x => x.type !== TokenType.EQUAL || this.peek(2).type !== TokenType.EQUAL);
		this.next(2);
		return `<mark>${content}</mark>`
	}

	private parseImage() {
		this.next(2);
		let alt = this.parseWhile(x => x.type !== TokenType.R_BRACKET);
		this.next(2);
		let source = this.readWhile(x => x.type !== TokenType.R_PAREN);
		this.next()
		return `<img src="${source}" alt="${alt}" />`
	}

	private parseLink() {
		this.next();
		let content = this.parseWhile(x => x.type !== TokenType.R_BRACKET);
		this.next(2);
		let source = this.readWhile(x => x.type !== TokenType.R_PAREN);
		this.next()
		return `<a href="${source}">${content}</a>`
	}

	private parseSubscript() {
		this.next()
		let content = this.parseWhile(x => x.type !== TokenType.TILDE);
		this.next()
		return `<sub>${content}</sub>`
	}

	private parseSuperscript() {
		this.next()
		let content = this.parseWhile(x => x.type !== TokenType.CARET);
		this.next()
		return `<sup>${content}</sup>`
	}

	private parseTable() {
		this.next()
		let token: Token;
		while((token = this.peek()) && token.type !== TokenType.NEWLINE) {
			
		}
	}

	private parseAtom() {
		const nextWhitespace = this.nextIs(TokenType.SPACE);
		const isFirst = this.peek().column_start === 0;

		if (this.isType(TokenType.ASTERISK) && this.isType(TokenType.ASTERISK, 2)) {
			return this.parseBold()
		} else if (this.isType(TokenType.ASTERISK) && !nextWhitespace) {
			// Italic
			return this.parseItalic()
		} else if (this.isType(TokenType.TILDE) && this.nextIs(TokenType.TILDE)) {
			return this.parseStrikethrough()
		} else if (this.isType(TokenType.TILDE) && !nextWhitespace) {
			return this.parseSubscript()
		} else if (this.isType(TokenType.CARET) && !nextWhitespace) {
			return this.parseSuperscript()
		} else if (this.isType(TokenType.HASH) && isFirst) {
			return this.parseHeading()
		} else if (this.isType(TokenType.GREATER) && isFirst && nextWhitespace) {
			return this.parseBlockquote()
		} else if (isFirst && this.isType(TokenType.BACKTICK) && this.peek(2).type === TokenType.BACKTICK && this.peek(3).type === TokenType.BACKTICK) {
			// Multi line code block.
			return this.parseMultiLineCode()
		} else if (this.isType(TokenType.BACKTICK)) {
			return this.parseInlineCode()
		} else if (isFirst && this.isType(TokenType.DASH) && this.peek(2).type === TokenType.DASH && this.peek(3).type === TokenType.DASH) {
			return this.parseHorizontalRule()
		} else if (this.isType(TokenType.EQUAL) && this.nextIs(TokenType.EQUAL)) {
			return this.parseHighlight()
		} else if (this.isType(TokenType.EXCLAMATION) && this.nextIs(TokenType.L_BRACKET)) {
			return this.parseImage()
		} else if (this.isType(TokenType.L_BRACKET)) {
			return this.parseLink()
		} else if (this.isType(TokenType.PIPE)) {
			return this.parseTable()
		} else {
			return this.parseText()
		}
	}
}

class Token {
	public line: number;
	public column_start: number;
	public column_end: number;
	constructor(public value: string, public type: TokenType) {

	}

	setLocation(line: number, column_start: number, column_end: number) {
		this.line = line;
		this.column_start = column_start;
		this.column_end = column_end;
	}

	get length(): number {
		return this.value.length;
	}
}

function compile(source: string) {
	let parser = new MarkdownParser();
	let tokens = tokenize(source);

	return parser.parse(tokens);
}

export {MarkdownParser, tokenize, compile }
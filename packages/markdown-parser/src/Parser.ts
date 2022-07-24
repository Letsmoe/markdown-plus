import { TokenType } from "./token.type.js";

function Parser(lexer: any) {
	function horizontalRule() {
		if (lexer.peek() === TokenType.DASH && lexer.peek(1) === TokenType.DASH) {
			while (!lexer.isEOF() && lexer.peek() === TokenType.DASH) {
				lexer.consume()
			}

			return { type: "HorizontalRule", indent: 0 }
		}
	}

	function header() {
		let depth = 1;
		while(!lexer.isEOF() && (lexer.peek() === TokenType.HASH)) {
			lexer.consume()
			depth++;
		}
		let children = parseDelimited(TokenType.NEWLINE);

		return { type: "Heading", depth, children, indent: 0 };
	}

	function list(children: any[] = []) {
		return { type: "list", children };
	}

	function listItem(title: string, ref: string = "", indent: number): any {
		return {
			type: "listItem",
			title,
			ref,
			indent,
		};
	}

	function createAST(statements: any): any {
		const listRefs: any = { 0: list() };
		statements.forEach((v: any, i: number, arr: any) => {
			if (i > 0 && arr[i - 1].indent > v.indent) {
				delete listRefs[arr[i - 1].indent];
			}

			if (listRefs.hasOwnProperty(v.indent)) {
				listRefs[v.indent].children.push(v);
			} else {
				listRefs[v.indent] = {
					type: "Program",
					children: [v],
				};

				listRefs[v.indent - 1].children.push(listRefs[v.indent]);
			}
		});

		return listRefs[0];
	}

	function inlineCode() {
		let content = "";
		while (!lexer.isEOF() && lexer.peek() !== TokenType.APOSTROPHE) {
			content += lexer.consume().lexeme;
		}

		lexer.consume()
		return { type: "InlineCode", text: content };
	}

	function parse() {
		const statements = [];
		while (!lexer.isEOF()) {
			const expr = expression();

			if (expr) {
				statements.push(expr);
			}
		}

		return {
			files: statements.filter((t) =>
				["link"].includes(t.type)
			),
			ast: createAST(statements),
		};
	}

	function inlineExpression(): any {
		const token = lexer.consume();
		if (token) {
			switch (token.type) {
				case TokenType.APOSTROPHE:
					return inlineCode()
				default:
			}
		}
	}

	function expression(numIndent = 0): any {
		const token = lexer.consume();

		switch (token.type) {
			case TokenType.DASH:
				return horizontalRule();
			case TokenType.HASH:
				return header();
			case TokenType.LEFT_BRACE:
				return parseLink();
			case TokenType.INDENT:
				return expression(numIndent + 1);
			case TokenType.DASH:
				return parseListItem(numIndent);
			default:
				return inlineExpression()
		}
	}

	function parseListItem(numIndent = 0): any {
		if (
			lexer.peek(0) === TokenType.LEFT_BRACE &&
			lexer.peek(1) === TokenType.STRING &&
			lexer.peek(2) === TokenType.RIGHT_BRACE
		) {
			const title = lexer.consume(1);
			let ref = "";
			if (lexer.peek(2) === TokenType.STRING) {
				ref = lexer.consume(2);
			}

			lexer.consume(); // Consume right parens

			return listItem(title.lexeme, ref.lexeme, numIndent);
		}
	}

	function parseDelimited(delimiter: TokenType) {
		const children = [];
		while (!lexer.isEOF() && lexer.peek() !== delimiter) {
			let expr = inlineExpression();

			if (expr) {
				children.push(expr)
			}
		}
		return children;
	}

	function parseLink(): any {
		const children = parseDelimited(TokenType.RIGHT_BRACE);
		const ref = lexer.consume(2);
		lexer.consume();

		return { type: "link", children, ref: ref.lexeme, indent: 0 };
	}

	return parse();
}
export { Parser }
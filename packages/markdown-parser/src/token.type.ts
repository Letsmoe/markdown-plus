enum TokenType {
	LEFT_PAREN,
	RIGHT_PAREN,
	LEFT_BRACE,
	RIGHT_BRACE,
	SPACE,
	INDENT,
	DASH,
	NEWLINE,
	APOSTROPHE,

	STRING,
	HASH,

	EOF,
}

interface Token {
	type: TokenType;
	lexeme: string | null;
}


export { TokenType, Token }
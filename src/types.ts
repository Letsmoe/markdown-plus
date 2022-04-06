enum TOKEN_TYPES {
	WHITESPACE = "WHITESPACE",
	BACKSLASH = "BACKSLASH",
	OPEN_CURLY = "OPEN_CURLY",
	CLOSE_CURLY = "CLOSE_CURLY",
	LETTER = "LETTER",
	DIGIT = "DIGIT",
	OPEN_BRACKET = "OPEN_BRACKET",
	CLOSE_BRACKET = "CLOSE_BRACKET",
	SPECIAL = "SPECIAL",
	NEWLINE = "NEWLINE",
	TAB = "TAB",
	POINT = "POINT",
}

enum COMPLEX {
	FLOAT = "FLOAT",
	INTEGER = "INTEGER",
	STRING = "STRING",
}

enum DATATYPE {

}

export {TOKEN_TYPES, DATATYPE, COMPLEX}
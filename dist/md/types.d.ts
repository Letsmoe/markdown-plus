declare enum TokenTypes {
    WHITESPACE = 0,
    NEWLINE = 1,
    HASH = 2,
    TEXT = 3,
    DASH = 4,
    BLOCKQUOTE = 5,
    OPEN_BRACKET = 6,
    CLOSE_BRACKET = 7,
    OPEN_PAREN = 8,
    CLOSE_PAREN = 9,
    ASTERISK = 10,
    UNDERSCORE = 11,
    BACKTICK = 12,
    PIPE = 13,
    COLON = 14,
    PERCENT = 15,
    OPEN_CURLY = 16,
    CLOSE_CURLY = 17,
    EXCLAMATION = 18,
    INDENT = 19
}
export { TokenTypes };

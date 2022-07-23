declare enum TokenType {
    LEFT_PAREN = 0,
    RIGHT_PAREN = 1,
    LEFT_BRACE = 2,
    RIGHT_BRACE = 3,
    SPACE = 4,
    INDENT = 5,
    DASH = 6,
    NEWLINE = 7,
    APOSTROPHE = 8,
    STRING = 9,
    HASH = 10,
    EOF = 11
}
interface Token {
    type: TokenType;
    lexeme: string | null;
}
export { TokenType, Token };

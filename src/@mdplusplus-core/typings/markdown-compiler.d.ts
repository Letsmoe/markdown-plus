declare enum TokenType {
    UNDERSCORE = 0,
    ASTERISK = 1,
    L_BRACKET = 2,
    R_BRACKET = 3,
    R_PAREN = 4,
    L_PAREN = 5,
    EXCLAMATION = 6,
    BACKTICK = 7,
    HASH = 8,
    NEWLINE = 9,
    WORD = 10,
    TILDE = 11,
    SPACE = 12,
    GREATER = 13
}
declare const tokenMap: {
    _: TokenType;
    "*": TokenType;
    "(": TokenType;
    ")": TokenType;
    "[": TokenType;
    "]": TokenType;
    "!": TokenType;
    "`": TokenType;
    "#": TokenType;
    "\n": TokenType;
    "~": TokenType;
    " ": TokenType;
    ">": TokenType;
};
declare function tokenize(text: string): Token[];
declare class MarkdownParser {
    private tokens;
    private cursor;
    private content;
    constructor();
    private peek;
    private next;
    parse(tokens: Token[]): string;
    private isType;
    private parseWhile;
    private parseText;
    private parseBold;
    private parseStrikethrough;
    private parseItalic;
    private readWhile;
    private skipWhitespace;
    private parseHeading;
    private parseBlockquote;
    private nextIs;
    private parseMultiLineCode;
    private parseInlineCode;
    private parseAtom;
}
declare class Token {
    value: string;
    type: TokenType;
    line: number;
    column_start: number;
    column_end: number;
    constructor(value: string, type: TokenType);
    setLocation(line: number, column_start: number, column_end: number): void;
    get length(): number;
}
declare const parser: MarkdownParser;
declare const tokens: Token[];
declare let code2: string;

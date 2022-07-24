var TokenType;
(function (TokenType) {
    TokenType[TokenType["LEFT_PAREN"] = 0] = "LEFT_PAREN";
    TokenType[TokenType["RIGHT_PAREN"] = 1] = "RIGHT_PAREN";
    TokenType[TokenType["LEFT_BRACE"] = 2] = "LEFT_BRACE";
    TokenType[TokenType["RIGHT_BRACE"] = 3] = "RIGHT_BRACE";
    TokenType[TokenType["SPACE"] = 4] = "SPACE";
    TokenType[TokenType["INDENT"] = 5] = "INDENT";
    TokenType[TokenType["DASH"] = 6] = "DASH";
    TokenType[TokenType["NEWLINE"] = 7] = "NEWLINE";
    TokenType[TokenType["APOSTROPHE"] = 8] = "APOSTROPHE";
    TokenType[TokenType["STRING"] = 9] = "STRING";
    TokenType[TokenType["HASH"] = 10] = "HASH";
    TokenType[TokenType["EOF"] = 11] = "EOF";
})(TokenType || (TokenType = {}));
export { TokenType };

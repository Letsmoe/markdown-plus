declare enum TOKEN_TYPE {
    STRING = "STRING",
    SYMBOL = "SYMBOL",
    FLOAT = "FLOAT",
    INTEGER = "INTEGER",
    OPEN_PAREN = "OPEN_PAREN",
    CLOSE_PAREN = "CLOSE_PAREN"
}
declare class Token {
    value: any;
    type: TOKEN_TYPE;
    constructor(value: any, type: TOKEN_TYPE);
}
declare const lexer: (input: string) => Token[];
declare const parser: (tokenArray: Token[]) => {
    body: any[];
    parent: any;
    name: string;
    arguments: any[];
};
declare let inputString: string;
declare let lexerOutput: Token[];

import { Token, TokenType } from "./token.type.js";
declare function Lexer(reader: any): Readonly<{
    peek: (nth?: number) => TokenType;
    consume: (nth?: number) => Token;
    isEOF: () => boolean;
    printTokens: () => void;
    printTokenType: () => void;
}>;
export { Lexer };

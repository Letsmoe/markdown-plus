import { InputStream } from "./input-stream.js";
declare class TokenStream {
    private stream;
    private KEYWORDS;
    private current;
    constructor(stream: InputStream);
    private isKeyword;
    private isDigit;
    private isIdentifierStart;
    private is_id;
    private is_op_char;
    private is_punc;
    private is_whitespace;
    private readWhile;
    private read_number;
    private readIdentifier;
    private read_escaped;
    private read_string;
    private skipComment;
    private read_next;
    peek(): any;
    next(): any;
    eof(): boolean;
    croak(msg: string): void;
}
export { TokenStream };

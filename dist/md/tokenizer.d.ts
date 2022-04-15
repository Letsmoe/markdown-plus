import { InputStream } from "../input-stream.js";
declare class Tokenizer {
    private stream;
    private current;
    tokens: any[];
    constructor(stream: InputStream);
    private readWhile;
    private addToken;
    private read_next;
    peek(): any;
    next(): any;
    eof(): boolean;
    croak(msg: string): void;
}
export { Tokenizer };

declare class InputStream {
    private input;
    private pos;
    private line;
    private col;
    constructor(input: string);
    next(): string;
    peek(): string;
    eof(): boolean;
    croak(msg: string): void;
}
export { InputStream };

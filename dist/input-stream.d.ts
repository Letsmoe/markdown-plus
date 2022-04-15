declare class InputStream {
    private input;
    pos: number;
    line: number;
    col: number;
    constructor(input: string);
    next(): string;
    peek(offset?: number): string;
    eof(): boolean;
    reset(): void;
    croak(msg: string): void;
}
export { InputStream };

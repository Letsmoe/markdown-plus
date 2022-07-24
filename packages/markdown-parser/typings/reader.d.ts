declare function TextReader(chars: string): Readonly<{
    peek: (nth?: number) => string;
    consume: (nth?: number) => string;
    isEOF: () => boolean;
}>;
export { TextReader };

import { TokenTypes } from "./types.js";
interface Token {
    type: TokenTypes;
    value: string;
}
declare class Parser {
    private tokens;
    private index;
    private lineStart;
    constructor(tokens: any[]);
    private doHeading;
    private skipWhitespace;
    private doText;
    private doBlockquote;
    private doList;
    private doHorizontal;
    private doLink;
    private doImage;
    private readWhile;
    private readWhileInterpolate;
    private doBoldOrEmphasize;
    private skipType;
    private doEmbedCode;
    private doNext;
    peek(offset?: number): any;
    next(len?: number): Token;
}
export { Parser };

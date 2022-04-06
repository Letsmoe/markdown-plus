import { Token } from "./token.js";
declare function Tokenize(input: string): Token[];
declare function MergeTokens(arrTokens: Token[]): Token[];
export { Tokenize, MergeTokens };

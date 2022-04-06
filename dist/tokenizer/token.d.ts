import { TOKEN_TYPES, COMPLEX } from "../types.js";
declare class Token {
    type: TOKEN_TYPES | COMPLEX;
    value: string;
    constructor(value: string);
    /**
     * Match the value of the current token to a specific token type for parsing later on.
     * @date 4/3/2022 - 11:52:14 PM
     */
    matchTokenType(): TOKEN_TYPES;
}
export { Token };

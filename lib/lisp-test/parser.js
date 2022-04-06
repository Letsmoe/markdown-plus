import { tokenize } from "./tokenize.js";
class ParseError extends Error {
    constructor(message) {
        super(message);
        this.name = "ParseError";
    }
}
const PARSE_ERROR = {
    EOF: "Unexpected end of file",
    unexpectedClosing: "Unexpected closing parenthesis",
    expectedClosingQuotes: "Expected closing quotes."
};
function consumeTokens(tokens, src) {
    if (!tokens.length)
        throw new ParseError(PARSE_ERROR.EOF);
    const token = tokens.shift();
    switch (token.value) {
        case "{": {
            const expression = [];
            while (tokens[0].value !== "}") {
                expression.push(consumeTokens(tokens, src));
                if (!tokens.length)
                    throw new ParseError(PARSE_ERROR.EOF);
            }
            tokens.shift();
            return expression;
        }
        case '"':
            /**
             * Strings are a little different. Given that strings are whitespace sensitive and tokenization
             * discards whitespaces, we simply capture the start and end positions and use that to grab the string.
             */
            const stringStart = token.start + 1;
            while (tokens[0].value !== '"' && tokens[0].value !== "\n") {
                tokens.shift(); // discard token
                if (!tokens.length)
                    throw new ParseError(PARSE_ERROR.EOF);
            }
            if (tokens[0].value === "\n")
                throw new ParseError(PARSE_ERROR.expectedClosingQuotes);
            const stringEnd = tokens.shift().end;
            return src.slice(stringStart, stringEnd);
        case "}":
            throw new ParseError(PARSE_ERROR.unexpectedClosing);
        default:
            const { value } = token;
            // Convert token a number if it's number-like
            return isNaN(+value) ? value : +value;
    }
}
function parse(src) {
    const tokens = tokenize(src, true);
    let result = consumeTokens(tokens, src);
    // If there's only one defined expression, return early
    if (!tokens.length)
        return result;
    result = [result];
    while (tokens.length) {
        result.push(consumeTokens(tokens, src));
    }
    return result;
}
export { parse };

var TOKEN_TYPE;
(function (TOKEN_TYPE) {
    TOKEN_TYPE["STRING"] = "STRING";
    TOKEN_TYPE["SYMBOL"] = "SYMBOL";
    TOKEN_TYPE["FLOAT"] = "FLOAT";
    TOKEN_TYPE["INTEGER"] = "INTEGER";
    TOKEN_TYPE["OPEN_PAREN"] = "OPEN_PAREN";
    TOKEN_TYPE["CLOSE_PAREN"] = "CLOSE_PAREN";
})(TOKEN_TYPE || (TOKEN_TYPE = {}));
class Token {
    constructor(value, type) {
        this.value = value;
        this.type = type;
    }
}
const lexer = (input) => {
    let pos = 0;
    const next = () => {
        if (pos >= input.length) {
            return null;
        }
        return input.charAt(pos++);
    };
    const rewind = () => pos--;
    const emitString = () => {
        // Return a string until we hit the next unescaped quote.
        let str = "";
        let token;
        let isEscaped = false;
        while ((token = next()) !== '"' || isEscaped) {
            str += token;
            if (token == "\\") {
                isEscaped = !isEscaped;
                continue;
            }
            isEscaped = false;
        }
        return [str, TOKEN_TYPE.STRING];
    };
    const emitNumber = (firstToken) => {
        let str = firstToken;
        let token;
        while (/[0-9.]/.test(token = next())) {
            str += token;
        }
        let type = str.includes(".") ? TOKEN_TYPE.FLOAT : TOKEN_TYPE.INTEGER;
        rewind();
        return [type == TOKEN_TYPE.FLOAT ? parseFloat(str) : parseInt(str), type];
    };
    const emitSymbol = (firstToken) => {
        let str = firstToken;
        let token;
        while (/[A-z]/.test(token = next())) {
            str += token;
        }
        rewind();
        return [str, TOKEN_TYPE.SYMBOL];
    };
    let tokenList = [];
    let currToken;
    while ((currToken = next()) !== null) {
        let type;
        let value = currToken;
        if (currToken === "{") {
            type = TOKEN_TYPE.OPEN_PAREN;
        }
        else if (currToken === "}") {
            type = TOKEN_TYPE.CLOSE_PAREN;
        }
        else if (/\d/.test(currToken)) {
            // Found a number.
            [value, type] = emitNumber(currToken);
        }
        else if (currToken === '"') {
            [value, type] = emitString();
        }
        else if (currToken === "\n" || currToken === " " || currToken === "\t") {
            // Skip newlines, whitespaces and tabs.
            continue;
        }
        else {
            [value, type] = emitSymbol(currToken);
        }
        let token = new Token(value, type);
        tokenList.push(token);
    }
    return tokenList;
};
const parser = (tokenArray) => {
    let parseMap = { body: [], parent: null, name: "_main_", arguments: [] };
    let lastWasFunctionDeclaration = false;
    for (const token of tokenArray) {
        if (token.type === TOKEN_TYPE.OPEN_PAREN) {
            // Opened a parenthesis, start a program;
            let program = {
                body: [],
                parent: parseMap,
                name: "",
                arguments: []
            };
            parseMap.body.push(program);
            parseMap = program;
            lastWasFunctionDeclaration = true;
            continue;
        }
        else if (token.type === TOKEN_TYPE.CLOSE_PAREN) {
            parseMap = parseMap.parent;
        }
        else if (token.type === TOKEN_TYPE.SYMBOL && lastWasFunctionDeclaration) {
            parseMap.name = token.value;
        }
        else {
            parseMap.arguments.push(token);
        }
        lastWasFunctionDeclaration = false;
    }
    return parseMap;
};
let inputString = `{define x 2}

{display {concat "Hello There" "World and \\" Token \\" "} 1 5.5}`;
let lexerOutput = lexer(inputString);
console.log(lexerOutput);
console.log(parser(lexerOutput));

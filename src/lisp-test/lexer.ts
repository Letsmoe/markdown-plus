enum TOKEN_TYPE {
	STRING = "STRING",
	SYMBOL = "SYMBOL",
	FLOAT = "FLOAT",
	INTEGER = "INTEGER",
	OPEN_PAREN = "OPEN_PAREN",
	CLOSE_PAREN = "CLOSE_PAREN"
}

class Token {
	constructor(public value: any, public type: TOKEN_TYPE) {}
}

const lexer = (input : string) => {
	let pos = 0;
	const next = () => {
		if (pos >= input.length) {
			return null
		}
		return input.charAt(pos++);
	}

	const rewind = () => pos--;

	const emitString = () : [string, TOKEN_TYPE] => {
		// Return a string until we hit the next unescaped quote.
		let str: string = "";
		let token: string;
		let isEscaped = false;
		while((token = next()) !== '"' || isEscaped) {
			str += token;
			if (token == "\\") {
				isEscaped = !isEscaped
				continue
			}
			isEscaped = false;
		}
		
		return [str, TOKEN_TYPE.STRING]
	}

	const emitNumber = (firstToken: string) : [number, TOKEN_TYPE] => {
		let str :string = firstToken;
		let token: string;
		while (/[0-9.]/.test(token = next())) {
			str += token;
		}
		let type = str.includes(".") ? TOKEN_TYPE.FLOAT : TOKEN_TYPE.INTEGER;
		rewind()

		return [type == TOKEN_TYPE.FLOAT ? parseFloat(str) : parseInt(str), type];
	}

	const emitSymbol = (firstToken: string) : [string, TOKEN_TYPE] => {
		let str :string = firstToken;
		let token: string;
		while (/[A-z]/.test(token = next())) {
			str += token;
		}
		rewind()

		return [str, TOKEN_TYPE.SYMBOL];
	}

	let tokenList : Token[] = []
	let currToken: string;
	while ((currToken = next()) !== null) {
		let type : TOKEN_TYPE;
		let value:string|number = currToken;
		if (currToken === "{") {
			type = TOKEN_TYPE.OPEN_PAREN
		} else if (currToken === "}") {
			type = TOKEN_TYPE.CLOSE_PAREN
		} else if (/\d/.test(currToken)) {
			// Found a number.
			[value, type] = emitNumber(currToken);
		} else if (currToken === '"') {
			[value, type] = emitString();
		} else if (currToken === "\n" || currToken === " " || currToken === "\t") {
			// Skip newlines, whitespaces and tabs.
			continue
		} else {
			[value, type] = emitSymbol(currToken)
		}

		let token = new Token(value, type)
		
		tokenList.push(token);
	}

	return tokenList;
}


const parser = (tokenArray : Token[]) => {
	let parseMap = {body: [], parent: null, name: "_main_", arguments: []};
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
			parseMap.body.push(program)
			parseMap = program
			lastWasFunctionDeclaration = true;
			continue
		} else if (token.type === TOKEN_TYPE.CLOSE_PAREN) {
			parseMap = parseMap.parent;
		} else if (token.type === TOKEN_TYPE.SYMBOL && lastWasFunctionDeclaration) {
			parseMap.name = token.value;
		} else {
			parseMap.arguments.push(token);
		}
		lastWasFunctionDeclaration =false
	}
	return parseMap
}

let inputString = `{define x 2}

{display {concat "Hello There" "World and \\" Token \\" "} 1 5.5}`

let lexerOutput = lexer(inputString)
console.log(lexerOutput)
console.log(parser(lexerOutput));


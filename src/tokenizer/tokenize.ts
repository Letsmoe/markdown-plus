import { TOKEN_TYPES, COMPLEX } from "../types.js";
import {Token} from "./token.js";

function SplitTokens(input: string) : string[] {
	return input.trim().split("").filter(x => x);
}

function Tokenize(input : string) {
	const INPUT_ARRAY = SplitTokens(input);
	const TOKEN_ARRAY: Token[] = [];

	for (let i = 0; i < INPUT_ARRAY.length; i++) {
		let token = INPUT_ARRAY[i];
		TOKEN_ARRAY.push(new Token(token));
	}

	return TOKEN_ARRAY;
}

/**
 * Converts an array of tokens in "base form" into complex datatypes like string and integer/float instead of "digit" or "letter";
 * @date 4/4/2022 - 9:59:59 PM
 *
 * @param {Token[]} arrTokens
 * @returns {Token[]}
 */
function MakeObjectTokens(arrTokens: Token[]): Token[] {
	for (const token of arrTokens) {
		if (token.type === TOKEN_TYPES.DIGIT) {
			if (token.value.includes(".")) {
				token.type = COMPLEX.FLOAT;
			} else {
				token.type = COMPLEX.INTEGER
			}
		}
	}

	return arrTokens;
}

function MergeTokens(arrTokens: Token[]):Token[] {
	let conversionMap= {
		"DIGIT": {
			"POINT": "DIGIT",
			"DIGIT": "DIGIT",
			"LETTER": "LETTER"
		},
		"LETTER": {
			"LETTER": "LETTER",
			"DIGIT": "LETTER",
			"POINT": "LETTER",

		},
	}

	let lastToken : Token;
	let newTokens: Token[] = [];
	for (let i = 0; i <= arrTokens.length; i++) {
		let currToken = arrTokens[i];
		if (lastToken && currToken) {
			if (conversionMap[lastToken.type] && conversionMap[lastToken.type][currToken.type]) {
				let typeConvert = conversionMap[lastToken.type][currToken.type];
				lastToken.value += currToken.value;
				lastToken.type = typeConvert;
				continue
			}
		}
		if (lastToken && lastToken.type !== TOKEN_TYPES.WHITESPACE && lastToken.type !== TOKEN_TYPES.NEWLINE) {
			newTokens.push(lastToken);
		}
		lastToken = currToken;
	}
	return newTokens;
}
export {Tokenize, MergeTokens}



import { marked } from "marked";
import stopWords from "./stopWords.js";

const SPECIAL_CHARS = /[^0-9a-zA-Z ]+/g;

class SearchIndex {
	// We need to map many sources to a single word in our vocab, we will store each as an array of source and weight.
	private vocab: { [key: string]: number[] } = {};
	private sourceMap: {[key: number]: string} = {};
	private index: number = 0;
	constructor(private lang: string = "en") {}

	public addSource(content: string, link: string = "") {
		this.sourceMap[this.index] = link;

		// Convert the content to raw words without markdown characters.
		const recurse = (tokens: any[], parent: any = {}) => {
			let contentArray = [];
			for (const token of tokens) {
				if (token.hasOwnProperty("tokens")) {
					contentArray = contentArray.concat(
						recurse(token.tokens, token)
					);
				} else {
					if (token.hasOwnProperty("text")) {
						let weight = 1;
						if (parent && parent.type === "heading") {
							weight += 6 - parent.depth;
						} else if (
							token.type === "code" ||
							token.type === "codespan"
						) {
							weight += 2;
						}
						contentArray.push({
							weight,
							text: token.text,
						});
					}
				}
			}
			return contentArray;
		};
		let lineArray = recurse(marked.lexer(content));
		/**
		 * Convert each line into tokens.
		 * First we need to remove all special characters
		 */
		for (let i = 0; i < lineArray.length; i++) {
			const { weight, text } = lineArray[i];
			let content = text.replace(SPECIAL_CHARS, "").trim();
			let tokens = content.split(/\s/);
			// Loop through all tokens and match them against the list of stop words.
			let langStopWords = stopWords[this.lang];
			if (!langStopWords) {
				throw new Error(
					"Could not find language in list of stop words."
				);
			}
			for (let token of tokens) {
				token = token.toLowerCase();
				// Check if the token is longer than 1 character
				if (token.length <= 1) {
					continue
				}
				// Check if the token is equal to a stop word.
				if (langStopWords.hasOwnProperty(token)) {
					continue;
				}

				// Check if the token is already present in the vocabulary.
				if (!this.vocab.hasOwnProperty(token)) {
					// Get the id from the vocabulary
					this.vocab[token] = [];
				}
				// Let's add it to the vocabulary.
				// We will use the szudzik pairing function so we only have to store one number.
				this.vocab[token].push(pair(this.index, weight));
			}
		}
		this.index++
		return this.vocab;
	}

	public getVocabulary() {
		return this.vocab;
	}

	public getIndex() {
		return {
			tokens: this.vocab,
			sources: this.sourceMap
		}
	}
}

function pair(x: number, y: number) {
	return x >= y ? x * x + x + y : y * y + x;
}

function unpair(z: number) {
	var sqrtz = Math.floor(Math.sqrt(z)),
		sqz = sqrtz * sqrtz;
	return z - sqz >= sqrtz ? [sqrtz, z - sqz - sqrtz] : [z - sqz, sqrtz];
}

class SearchEngine {
	private tokens: {[key: string]: number[]};
	private sources: {[key: number]: string};

	constructor(index: {tokens: {[key: string]: number[]}, sources: {[key: number]: string}}) {
		this.tokens = index.tokens;
		this.sources = index.sources;
	}

	public search(query: string) {
		const files = {};

		query = query.trim().replace(SPECIAL_CHARS, "");
		let tokens = query.split(" ");
		// Search the index for each token
		for (let token of tokens) {
			token = token.toLowerCase()
			// We can't do anything if the index does not contain the token.
			if (!this.tokens.hasOwnProperty(token)) {
				continue;
			}
			// If it does we need to get the array and unpair the values contained.
			const result = this.tokens[token].map(x => unpair(x));
			// Each result set now contains the id of the file and the weight of the token.
			// If the files list already contains the file id we can just increment it's value by the token's weight
			for (const resultSet of result) {
				if (!files.hasOwnProperty(resultSet[0])) {
					// We need to create the file first.
					files[resultSet[0]] = resultSet[1];
				}
				// It already exists, let's increment by the weight
				files[resultSet[0]] += resultSet[1]
			}
		}
		return files;
	}
}

const index = new SearchIndex();

index.addSource(`
# Heading 1
This is some \`content\` which will be used to generate an index on the content.
Anyway, let's talk about the ternary operator.

\`\`\`
Welp, this is somewhat weird...
\`\`\`
`);

index.addSource(`
---
title: if/else - Gyro
author: letsmoe
---

# if/else

Conditionals are a basic part of every programming language. Branches in Gyro have to be surrounded by parentheses, like in Python the \`else if\` branch is declared as \`elif\`.

\`\`\`gyro
const main = func() {
	var n = 42;

	if (n < 0) {
		printf("%s is negative", n);
	} elif (n > 0) {
		printf("%s is positive", n);
	} else {
		printf("%s is zero", n);
	}

	return n;
}
\`\`\`

There is an available short form of \`if/else\` called the [[Ternary]] operator, it is specified in two versions, a \`Symboled Ternary\` and a \`Written Ternary\`.

\`\`\`gyro
var n = (10 if (5 > 4) else 8);
\`\`\`
Written Ternary

\`\`\`gyro
var n = (5 > 4) ? 10 : 8;
\`\`\`
Symboled Ternary
`)

console.log(index.getVocabulary())

const search = new SearchEngine(index.getIndex())

console.log(search.search("Ternary"))
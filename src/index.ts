import {Token, Tokenize, MergeTokens} from "./tokenizer/index.js";
import {Parse} from "./parser/index.js";


function ParseMarkdownPlus(input: string) {
	let output = Tokenize(input);
	let tokens = MergeTokens(output);
	return Parse(tokens);
}

const PROGRAMMING_SYNTAX_TEST = `{define var {+ 1 {- 2 4.5}}}`

const CHAR_TEST = `
This is a paragraph containing a {{VA1UE}} and a 0.5 float and 125 normal number...!
`

const TEST = `
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

Default Paragraph

----

This was a break;

[My Website](https://continuum-ai.de)

`

let result = ParseMarkdownPlus(PROGRAMMING_SYNTAX_TEST);
console.log(result);
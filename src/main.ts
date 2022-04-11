import {InputStream} from "./input-stream.js";
import {TokenStream} from "./token-stream.js";

const code = `
const x = 4 + 5.5;

# for (let i = 0; i < 5; i++) {
# 	printf("%d", i);
# 
# 	print(2 + 5.5);
# }
# 
# let variableName = "Value";
# function defaultFunction(arg1, arg2) {
# 	print(arg1 * 2);
# }`;

const stream = new InputStream(code);
const tokens = new TokenStream(stream)

while (tokens.peek()) {
	console.log(tokens.next());
}


//var lex = new Lexer(code);

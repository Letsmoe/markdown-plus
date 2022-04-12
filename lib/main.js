import { InputStream } from "./input-stream.js";
import { TokenStream } from "./token-stream.js";
import { parse } from "./parser.js";
const code = `
x = 4 + 5.5 ** 2;

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
const tokens = new TokenStream(stream);
const parsed = parse(tokens);
console.log(parsed);
//var lex = new Lexer(code);

import { Lexer } from "./lexer.js";
import { Parser } from "./Parser.js";
import { TextReader } from "./reader.js";
export { parse };
function parse() {
    const content = `

# [\`Nice\` And Cool](https://github.com/)
	
## \`HEading2\`

---

`;
    const reader = TextReader(content);
    const lexer = Lexer(reader);
    lexer.printTokens();
    const { files, ast } = Parser(lexer);
    return { files, ast };
}
console.log(JSON.stringify(parse().ast, null, 2));

import { InputStream } from "../input-stream.js";
import { TokenStream } from "../token-stream.js";
import { parse } from "../parser.js";
import { evaluate } from "../interpreter.js";
function parseAndEvaluate(value, env) {
    const stream = new InputStream(value);
    const tokens = new TokenStream(stream);
    const parsed = parse(tokens);
    evaluate(parsed, env);
    return env;
}
export { parseAndEvaluate };

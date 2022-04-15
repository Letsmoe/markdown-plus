import { Environment } from "../interpreter.js";
declare function parseAndEvaluate(value: string, env: typeof Environment): typeof Environment;
export { parseAndEvaluate };

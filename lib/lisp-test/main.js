import { parse } from "./parser.js";
import * as fs from "fs";
import { Variable } from "./variable.js";
import * as path from "path";
const globals = {
    "+": (scope, ...operands) => operands.reduce((acc, curr) => acc + curr, 0),
    "-": (scope, ...operands) => operands.reduce((acc, curr) => acc - curr),
    "*": (scope, ...operands) => operands.reduce((acc, curr) => acc * curr, 1),
    "/": (scope, ...operands) => operands.reduce((acc, curr) => acc / curr),
    "print": (scope, ...operands) => {
        console.log(operands.map(x => x.valueOf()).join(" "));
    },
    "<": (scope, ...operands) => operands.reduce((acc, curr) => acc < curr),
    ">": (scope, ...operands) => operands.reduce((acc, curr) => acc > curr),
    "=": (scope, ...operands) => operands.reduce((acc, curr) => acc == curr),
    "<=": (scope, ...operands) => operands.reduce((acc, curr) => acc <= curr),
    ">=": (scope, ...operands) => operands.reduce((acc, curr) => acc >= curr),
    "and": (scope, ...operands) => {
        for (const x of operands) {
            if (!x)
                return false;
        }
        return true;
    },
    "or": (scope, ...operands) => operands.reduce((acc, curr) => acc || curr ? true : false),
    "make-immut": (scope, ...operands) => {
        for (const i of operands) {
            i.immutable = true;
        }
    },
    "copy": (scope, reference) => {
        return reference.valueOf();
    },
    "function": (scope, name, argsNames, body = undefined) => {
        if (scope[name.valueOf()] === undefined) {
            scope[name.valueOf()] = (fnScope, ...args) => {
                const fnLocalScope = Object.assign(Object.assign({}, fnScope), args
                    .map((arg, index) => [argsNames[index], args[index].valueOf()])
                    .reduce((acc, [arg, val]) => (Object.assign(Object.assign({}, acc), { [arg]: val })), {}));
                return evalExpression(body, fnLocalScope);
            };
        }
        else {
            throw new Error(`Name already defined in scope: ${name}`);
        }
    },
    define: (scope, name, value) => {
        if (scope[name] === undefined) {
            scope[name.valueOf()] = new Variable(name, value);
        }
        else {
            throw new Error(`Name already defined in scope: ${name}`);
        }
    },
    set: (scope, name, value) => {
        scope[name.name.valueOf()].setValue(value);
    },
    import: function (scope, pathName, moduleNames) {
        // Imports a file and parses this file, adds methods to the scope.
        let result = this.fetch(scope, pathName);
        let [output, childScope] = evaluate(result);
        for (const name of moduleNames) {
            if (!scope[name]) {
                scope[name] = childScope[name];
            }
            else {
                throw new Error(`Can not import ${name} since it already exists in target scope.`);
            }
        }
    },
    fetch: (scope, pathName) => {
        pathName = path.join(process.cwd(), pathName);
        if (fs.existsSync(pathName)) {
            let result = fs.readFileSync(pathName, 'utf8');
            return result;
        }
        else {
            throw new Error(`File at '${path}' does not exist.`);
        }
    },
    for: (scope, iterators, executionMethod) => {
        // Get the items to iterate over.
        const loopScope = Object.assign({}, scope);
        let iteratorLength = iterators[0][1].length;
        for (let i = 0; i < iteratorLength; i++) {
            for (let j = 0; j < iterators.length; j++) {
                const iterator = iterators[j];
                let value = iterator[1][i];
                if (typeof value !== "undefined") {
                    loopScope[iterator[0]] = value;
                }
                else {
                    // Loop around back
                    loopScope[iterator[0]] = iterator[1][i % iterator[1].length];
                }
            }
            evalExpression(executionMethod, loopScope);
        }
    }
};
function evaluate(src) {
    const ast = parse(src);
    // Handle case of multiple expressions
    let scope = Object.assign({}, globals);
    if (Array.isArray(ast[0])) {
        let result;
        for (const expression of ast) {
            result = evalExpression(expression, scope);
        }
        // Returns the result of the last expression
        return [result, scope];
    }
    else {
        // If it's only a single expression, eval that and return
        return [evalExpression(ast, scope), scope];
    }
}
function evalExpression(astExpression, scope) {
    if (!Array.isArray(astExpression)) {
        return astExpression in scope ? scope[astExpression] : astExpression;
    }
    const operation = astExpression[0];
    let argsArray = [];
    if (operation !== "function" && operation !== "for") {
        // We can't just execute the body when defining a function or running a loop!
        for (const [index, node] of astExpression.entries()) {
            argsArray.push(evalExpression(node, scope));
        }
    }
    else {
        argsArray = astExpression;
    }
    if (!(operation in scope))
        return astExpression;
    return scope[operation](scope, ...argsArray.slice(1));
}
const input = `
{import "./test.mdp" {"add" "multiply"}}

{print {multiply {multiply {multiply 1 2} 3} 3}}

{define a {1 2 3}}

{print a}

; {print {fetch "./test.mdp"}}

{for {{i {1 2 3 4 5 6 7}}
	  {y {4 5}}}
	{print i y}}`;
let [result, scope] = evaluate(input);

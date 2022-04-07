import {parse} from "./parser.js";
import * as fs from "fs";
import { URL } from 'url';
import { Variable } from "./variable.js";
import * as path from "path";


const globals = {
	"+": (scope : {}, ...operands : any[]) => operands.reduce((acc, curr) => acc + curr, 0),
	"-": (scope : {}, ...operands : any[]) => operands.reduce((acc, curr) => acc - curr),
	"*": (scope : {}, ...operands : any[]) => operands.reduce((acc, curr) => acc * curr, 1),
	"/": (scope : {}, ...operands : any[]) => operands.reduce((acc, curr) => acc / curr),
	"print": (scope : {}, ...operands : any[]) => {
		console.log(operands.map(x => x).join(" "))
	},
	"<": (scope : {}, ...operands : any[]) => operands.reduce((acc, curr) => acc < curr),
	">": (scope : {}, ...operands : any[]) => operands.reduce((acc, curr) => acc > curr),
	"=": (scope : {}, ...operands : any[]) => operands.reduce((acc, curr) => acc == curr),
	"<=": (scope : {}, ...operands : any[]) => operands.reduce((acc, curr) => acc <= curr),
	">=": (scope : {}, ...operands : any[]) => operands.reduce((acc, curr) => acc >= curr),
	"and": (scope : {}, ...operands : any[]) => {
		for (const x of operands) {
			if (!x) return false;
		}
		return true
	},
	"or": (scope : {}, ...operands : any[]) => operands.reduce((acc, curr) => acc || curr ? true : false),
	"make-immut": (scope : {}, ...operands : any[]) => {
		for (const i of operands) {
			i.immutable = true;
		}
	},
	"copy": (scope : {}, reference : Variable) => {
		return reference;
	},
	"function": (scope : {}, name : string, argsNames : any[], body : any = undefined) => {
		if (scope[name] === undefined) {
			scope[name] = (fnScope : {}, ...args : any[]) => {
				const fnLocalScope = {
					...fnScope,
					...args
						.map((arg, index) => [argsNames[index], args[index]])
						.reduce((acc, [arg, val]) => ({ ...acc, [arg]: val }), {}),
				};
				return evalExpression(body, fnLocalScope);
			}
		} else {
			throw new Error(`Name already defined in scope: ${name}`);
		}
	},
	define: (scope: {}, name:string, value: any) => {
		if (scope[name] === undefined) {
			scope[name] = new Variable(name, value);
		} else {
			throw new Error(`Name already defined in scope: ${name}`);
		}
	},
	set: (scope : {}, name : any, value : any) => {
		scope[name].setValue(value);
	},
	import: function(scope : {}, pathName : string, moduleNames : string[]) {
		// Imports a file and parses this file, adds methods to the scope.
		let result = globals.fetch(scope, pathName)
		let [output, childScope] = evaluate(result);
		for (const name of moduleNames) {
			if (!scope[name]) {
				scope[name] = childScope[name];
			} else {
				throw new Error(`Can not import ${name} since it already exists in target scope.`)
			}
		}
	},
	fetch: (scope : {}, pathName : string) => {
		pathName = path.join(process.cwd(), pathName);
		if (fs.existsSync(pathName)) {
			let result = fs.readFileSync(pathName, 'utf8');
			return result
		} else {
			throw new Error(`File at '${path}' does not exist.`);
		}
	},
	for: (scope : {}, iterators : any[], executionMethod : any) => {
		// Get the items to iterate over.
		const loopScope = { ...scope };
		let iteratorLength = iterators[0][1].length;

		for (let i = 0; i < iteratorLength; i++) {
			for (let j = 0; j < iterators.length; j++) {
				const iterator = iterators[j];
				let value = iterator[1][i];
				if (typeof value !== "undefined") {
					loopScope[iterator[0]] = value;
				} else {
					// Loop around back
					loopScope[iterator[0]] = iterator[1][i % iterator[1].length]
				}
			}
			evalExpression(executionMethod, loopScope)
		}
	},
	if: (scope : {}, ...conditions : any[]) => {
		console.log("HELLO");
		
		console.log(conditions) // [ [ [ '=', 0, 0 ], 1 ], [ 'else', [ '+', 2, 4 ] ] ]

		for (const condition of conditions) {
			let cond = condition[0];
			let result = condition[1];
			if (cond === "else") {
				// Else stack
				return evalExpression(result, scope);
			} else {
				let isTrue = evalExpression(cond, scope);
				if (isTrue) {
					return evalExpression(result, scope);
				}
			}
		}
	}
};

function evaluate(src : string) {
	const ast = parse(src);
	// Handle case of multiple expressions
	let scope = { ...globals };
	if (Array.isArray(ast[0])) {
		let result : any;
		for (const expression of ast) {
			result = evalExpression(expression, scope);
		}
		// Returns the result of the last expression
		return [result, scope];
	} else {
		// If it's only a single expression, eval that and return
		return [evalExpression(ast, scope), scope];
	}
}

function evalExpression(astExpression : any[] | string, scope : {}) {
	if (!Array.isArray(astExpression)) {
		return astExpression in scope ? scope[astExpression] : astExpression;
	}
	const operation = astExpression[0];
	
	let argsArray = [];

	if (operation !== "function" && operation !== "for") {
		// We can't just execute the body when defining a function or running a loop!
		for (const [index, node] of astExpression.entries()) {
			argsArray.push(evalExpression(node, scope))
		}
	} else {
		argsArray = astExpression
	}
	
	if (!(operation in scope)) return astExpression;
	if (scope[operation]) {
		return scope[operation].valueOf()(scope, ...argsArray.slice(1));
	} else {
		throw new ReferenceError(`Method is not defined in scope "${operation}"`);
	}
}

const input = `
{import "./test.mdp" {"multiply" "fibo"}}

{print {fibo 5}}

{print {multiply {multiply {multiply 1 2} 3} 3}}

{define a {1 2 3}}

{print a}

; {print {fetch "./test.mdp"}}

{for {{i {1 2 3 4 5 6 7}}
	  {y {4 5}}}
	{print i y}}`

let [result, scope] = evaluate(input);
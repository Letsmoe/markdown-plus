const FALSE = false;
function make_js(exp) {
    return js(exp);
    function js(exp) {
        switch (exp.type) {
            case "number":
            case "string":
            case "boolean":
                return doAtom(exp);
            case "identifier":
                return doIdentifier(exp);
            case "BinaryExpression":
                return doBinaryExpression(exp);
            case "AssignmentExpression":
                return doAssignment(exp);
            case "let":
                return doLetExpression(exp);
            case "FunctionDeclaration":
                return doFunction(exp);
            case "if":
                return doConditional(exp);
            case "Program":
                return doProgram(exp);
            case "CallExpression":
                return doFunctionCall(exp);
            default:
                throw new Error("Transpilation failed for: " + JSON.stringify(exp));
        }
    }
    function doAtom(exp) {
        return JSON.stringify(exp.value); // cheating ;-)
    }
    function make_var(name) {
        return name;
    }
    function doIdentifier(exp) {
        return exp.value;
    }
    function doBinaryExpression(exp) {
        return "(" + js(exp.left) + exp.operator + js(exp.right) + ")";
    }
    // assign nodes are compiled the same as binary
    function doAssignment(exp) {
        return doBinaryExpression(exp);
    }
    function doFunction(exp) {
        var code = "(function ";
        if (exp.name)
            code += make_var(exp.name);
        code += "(" + exp.vars.map(make_var).join(", ") + ") {";
        code += "return " + js(exp.body) + " })";
        return code;
    }
    function doLetExpression(exp) {
        if (exp.vars.length == 0)
            return js(exp.body);
        var iife = {
            type: "call",
            func: {
                type: "lambda",
                vars: [exp.vars[0].name],
                body: {
                    type: "let",
                    vars: exp.vars.slice(1),
                    body: exp.body,
                },
            },
            args: [exp.vars[0].def || FALSE],
        };
        return "(" + js(iife) + ")";
    }
    function doConditional(exp) {
        return ("(" +
            js(exp.cond) +
            " !== false" +
            " ? " +
            js(exp.then) +
            " : " +
            js(exp.else || FALSE) +
            ")");
    }
    function doProgram(exp) {
        return "(" + exp.body.map(js).join(", ") + ")";
    }
    function doFunctionCall(exp) {
        return js(exp.callee) + "(" + exp.args.map(js).join(", ") + ")";
    }
}
export { make_js };
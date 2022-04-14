var FALSE = { type: "bool", value: false };
function parse(input) {
    var PRECEDENCE = {
        "=": 1,
        "||": 2,
        "&&": 3,
        "<": 7,
        ">": 7,
        "<=": 7,
        ">=": 7,
        "==": 7,
        "!=": 7,
        "+": 10,
        "-": 10,
        "*": 20,
        "/": 20,
        "%": 20,
        "**": 30,
    };
    return parseToplevel();
    function is_punc(ch) {
        var tok = input.peek();
        return (tok && tok.type == "punctuation" && (!ch || tok.value == ch) && tok);
    }
    function isKeyword(kw) {
        var tok = input.peek();
        return tok && tok.type == "keyword" && (!kw || tok.value == kw) && tok;
    }
    function isOperator(op) {
        var tok = input.peek();
        return tok && tok.type == "operator" && (!op || tok.value == op) && tok;
    }
    function skipPunctuation(ch) {
        if (is_punc(ch))
            input.next();
        else
            input.croak('Expecting punctuation: "' + ch + '"');
    }
    function skipKeyword(kw) {
        if (isKeyword(kw))
            input.next();
        else
            input.croak('Expecting keyword: "' + kw + '"');
    }
    function skip_op(op) {
        if (isOperator(op))
            input.next();
        else
            input.croak('Expecting operator: "' + op + '"');
    }
    function unexpected() {
        input.croak("Unexpected token: " + JSON.stringify(input.peek()));
    }
    function maybeBinary(left, my_prec) {
        var tok = isOperator();
        if (tok) {
            var his_prec = PRECEDENCE[tok.value];
            if (his_prec > my_prec) {
                input.next();
                return maybeBinary({
                    type: tok.value == "="
                        ? "AssignmentExpression"
                        : "BinaryExpression",
                    operator: tok.value,
                    left: left,
                    right: maybeBinary(parseAtom(), his_prec),
                }, my_prec);
            }
        }
        return left;
    }
    function delimited(start, stop, separator, parser) {
        var a = [], first = true;
        skipPunctuation(start);
        while (!input.eof()) {
            if (is_punc(stop))
                break;
            if (first)
                first = false;
            else
                skipPunctuation(separator);
            if (is_punc(stop))
                break;
            a.push(parser());
        }
        skipPunctuation(stop);
        return a;
    }
    function parseCall(func) {
        return {
            type: "CallExpression",
            callee: func,
            args: delimited("(", ")", ",", parseExpression),
        };
    }
    function parseIdentifier() {
        var name = input.next();
        if (name.type != "identifier")
            input.croak("Expecting variable name");
        return name.value;
    }
    function parseIf() {
        skipKeyword("if");
        var cond = parseExpression();
        if (!is_punc("{"))
            skipKeyword("then");
        var then = parseExpression();
        var ret = {
            type: "if",
            cond: cond,
            then: then,
        };
        if (isKeyword("else")) {
            input.next();
            ret.else = parseExpression();
        }
        return ret;
    }
    function parseFunction() {
        return {
            type: "FunctionDeclaration",
            vars: delimited("(", ")", ",", parseIdentifier),
            body: parseExpression(),
        };
    }
    function parseBoolean() {
        let val = input.next().value;
        return {
            type: "bool",
            value: val == "true",
        };
    }
    function maybeCall(expr) {
        expr = expr();
        return is_punc("(") ? parseCall(expr) : expr;
    }
    function parseArray() {
        return {
            type: "ArrayExpression",
            elements: delimited("[", "]", ",", parseAtom),
        };
    }
    function parseAtom() {
        return maybeCall(function () {
            if (is_punc("(")) {
                input.next();
                var exp = parseExpression();
                skipPunctuation(")");
                return exp;
            }
            if (is_punc("{"))
                return parseProgram();
            if (isKeyword("if"))
                return parseIf();
            if (is_punc("["))
                return parseArray();
            if (isKeyword("true") || isKeyword("false"))
                return parseBoolean();
            if (isKeyword("func") || isKeyword("λ")) {
                input.next();
                return parseFunction();
            }
            var tok = input.next();
            if (tok.type == "identifier" ||
                tok.type == "number" ||
                tok.type == "string")
                return tok;
            unexpected();
        });
    }
    function parseToplevel() {
        var prog = [];
        while (!input.eof()) {
            prog.push(parseExpression());
            if (!input.eof())
                skipPunctuation(";");
        }
        return { type: "Program", body: prog };
    }
    function parseProgram() {
        var prog = delimited("{", "}", ";", parseExpression);
        if (prog.length == 0)
            return FALSE;
        if (prog.length == 1)
            return prog[0];
        return { type: "Program", body: prog };
    }
    function parseExpression() {
        return maybeCall(function () {
            return maybeBinary(parseAtom(), 0);
        });
    }
}
export { parse };

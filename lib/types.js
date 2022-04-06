var TOKEN_TYPES;
(function (TOKEN_TYPES) {
    TOKEN_TYPES["WHITESPACE"] = "WHITESPACE";
    TOKEN_TYPES["BACKSLASH"] = "BACKSLASH";
    TOKEN_TYPES["OPEN_CURLY"] = "OPEN_CURLY";
    TOKEN_TYPES["CLOSE_CURLY"] = "CLOSE_CURLY";
    TOKEN_TYPES["LETTER"] = "LETTER";
    TOKEN_TYPES["DIGIT"] = "DIGIT";
    TOKEN_TYPES["OPEN_BRACKET"] = "OPEN_BRACKET";
    TOKEN_TYPES["CLOSE_BRACKET"] = "CLOSE_BRACKET";
    TOKEN_TYPES["SPECIAL"] = "SPECIAL";
    TOKEN_TYPES["NEWLINE"] = "NEWLINE";
    TOKEN_TYPES["TAB"] = "TAB";
    TOKEN_TYPES["POINT"] = "POINT";
})(TOKEN_TYPES || (TOKEN_TYPES = {}));
var COMPLEX;
(function (COMPLEX) {
    COMPLEX["FLOAT"] = "FLOAT";
    COMPLEX["INTEGER"] = "INTEGER";
    COMPLEX["STRING"] = "STRING";
})(COMPLEX || (COMPLEX = {}));
var DATATYPE;
(function (DATATYPE) {
})(DATATYPE || (DATATYPE = {}));
export { TOKEN_TYPES, DATATYPE, COMPLEX };
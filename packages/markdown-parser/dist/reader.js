function TextReader(chars) {
    let i = 0;
    function peek(nth = 0) {
        return chars[i + nth];
    }
    function consume(nth = 0) {
        const c = chars[i + nth];
        i = i + nth + 1;
        return c;
    }
    function isEOF() {
        return chars.length - 1 < i;
    }
    return Object.freeze({
        peek,
        consume,
        isEOF,
    });
}
export { TextReader };

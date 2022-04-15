interface Rule {
    token: RegExp | string;
    transform: (all: string, ...args: string[]) => string;
}
declare class Tokenizer {
    private input;
    private rules;
    output: string;
    constructor(input: string);
    private _start;
    applyRule(rule: Rule): void;
    addRule(rule: Rule | Rule[]): void;
}
export { Tokenizer };

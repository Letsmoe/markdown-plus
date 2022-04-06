declare class Variable {
    name: string;
    private _value;
    immutable: boolean;
    constructor(name: string, _value: any);
    valueOf(): any;
    toString(): string;
    setValue(value: any): void;
}
export { Variable };

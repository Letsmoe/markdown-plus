declare type Type = "string" | "boolean" | "number";
interface Option {
    alias: string;
    desc: string;
    type: "string" | "number" | "boolean";
    default: string | number | boolean;
    callback?: Function;
    required: boolean;
}
declare const COLORS: {
    CLEAR: string;
    UNDERLINE: string;
    CYAN: string;
    BLUE: string;
    GREEN: string;
    RED: string;
    YELLOW: string;
};
declare const color: (str: string | string[], col: string) => any;
declare function cArgs(argv: string[]): Readonly<{
    options: (opts: {
        [key: string]: Option;
    }) => any;
    readonly args: {
        [key: string]: any;
    };
    option: (name: string, alias: string, def: any, desc: string, required?: boolean, type?: Type) => any;
    command: (name: string, opts: Option, callback: Function) => void;
    usage: (usage: string) => any;
    set: (optionName: string, value: boolean | string | number) => any;
    help: () => any;
}>;
export { cArgs, COLORS, color };

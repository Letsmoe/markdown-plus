type Type = "string" | "boolean" | "number";

interface Option {
	alias: string;
	desc: string;
	type: "string" | "number" | "boolean";
	default: string | number | boolean;
	callback?: Function,
	required: boolean
}

const COLORS = {
	CLEAR: "\u001b[0m",
	UNDERLINE: "\u001b[4m",
	CYAN: "\u001b[36m",
	BLUE: "\u001b[34m]",
	GREEN: "\u001b[32m",
	RED: "\u001b[31m",
	YELLOW: "\u001b[33m",
}

const underline = (str: string | string[]) => {
	if (Array.isArray(str)) {
		return str.map(x => underline(x));
	}
	return COLORS.UNDERLINE + str + COLORS.CLEAR;
}

const color = (str: string | string[], col : string) => {
	if (Array.isArray(str)) {
		return str.map(x => color(x, col));
	}
	return col + str + COLORS.CLEAR;
}

function cArgs(argv : string[]) {
	function parseArguments(argv : string[], optionList: {[key: string]: Option}) : {[key: string]: any} {
		let foundArguments = {_default: []};
		// Loop through given options to pre-assign default values.
		for (const opt in optionList) {
			let optVal = optionList[opt];
			if (optVal.callback) {
				// It is a command, don't add it to the list of arguments
				continue
			}
			foundArguments[optVal.alias] = optVal.default;
			foundArguments[opt] = optVal.default;
		}
		let args = {
			index: 0,
			next: function() {
				let value = argv[this.index]
				this.index++
				return value;
			},
			peek: function() {
				if (this.index === argv.length) {
					return null
				}
				return argv[this.index]
			}
		}

		const setOption = (name: string, opt: Option, value : string) => {
			let type = opt.type, newValue: string | boolean | number;
			if (type === "boolean") {
				if (value === "true" || ["yes", "y"].indexOf(value.toLowerCase()) >= 0) {
					newValue = true;
				} else {
					newValue = false;
				}
			} else if (type === "number") {
				newValue = parseInt(value);
			} else if (type === "string") {
				newValue = value.toString();
			}
			
			foundArguments[opt.alias] = newValue;
			foundArguments[name] = newValue;
		};

		const captureCommand = (opt: Option) => {
			let argArray : string[] = []
			let value: string;
			while ((value = args.peek())) {
				if (value.startsWith("-")) {
					break;
				}
				argArray.push(args.next());
			}

			if (opt.callback) {
				opt.callback(...argArray);
			}
		}

		while(args.peek()) {
			let arg = args.next()
			let value: string | boolean | number, option : Option, argName: string;
			// Assume the first argument to be a name.
			if (arg.startsWith("--")) {
				// Named argument, lookup the mains
				argName = arg.substring(2);
				if (optionList.hasOwnProperty(argName)) {
					option = optionList[argName];
					if (option.callback) {
						captureCommand(option)
						continue
					}
					value = args.next()
					setOption(argName, option, value);
				} else {
					process.stdout.write("Invalid property passed: " + argName);
				}
			} else if (arg.startsWith("-")) {
				// Aliased argument
				argName = arg.substring(1);
				for (const key in optionList) {
					if (optionList[key].alias === argName) {
						option = optionList[key];
						if (option.callback) {
							captureCommand(option)
							continue
						}
						value = args.next()
						setOption(key, option, value);
						break;
					}
				}
			} else {
				// Assume argument to be a value.
				value = arg
			}

			if (!argName) {
				// Add it to the list of default arguments.
				if (parserOptions.CAPTURE_DEFAULTS) {
					foundArguments._default.push(value);
				} else {
					throw new Error("We're not taking someone onboard who doesn't even know their name! Go away!")
				}
			}
		}

		// Iterate over the arguments once to check if every required option is fulfilled.
		for (const key in optionList) {
			let option = optionList[key];
			if (option.required && !foundArguments[key]) {
				throw new Error(`Missing required argument: --${key} | -${option.alias}`);
			}
		}
		return foundArguments;
	}

	const optionList : {[key: string]: Option} = {};
	const parserOptions = {
		CAPTURE_DEFAULTS: true,
	}
	var usageString : string;

	function generateHelp() {
		const maxLength = (arrString : string[]) => arrString.reduce((acc, curr) => curr.length > acc ? curr.length : acc, 0);
		const writePadded = (str : string, max: number) => str.padEnd(max + 3);
		const writeArray = (arr : string[][]) => {
			let lenName = maxLength(arr.map(x => x[0]));
			let lenAlias = maxLength(arr.map(x => x[1]));
			let lenDesc = maxLength(arr.map(x => x[2]));
			let lenType = maxLength(arr.map(x => x[3]));
			let lenCallback = maxLength(arr.map(x => x[4]))

			for (const item of arr) {
				process.stdout.write(writePadded(item[0], lenName) + writePadded(item[1], lenAlias) + writePadded(item[2], lenDesc) + writePadded(item[3], lenType) + writePadded(item[4], lenCallback) + "\n");
			}
		}

		let arr = [];
		for (const key in optionList) {
			let val = optionList[key];
			arr.push([color("--" + key, COLORS.CYAN), color("-" + val.alias, COLORS.YELLOW), val.desc, val.type ? `[${val.type.toUpperCase()}]` : "", val.callback ? color("[COMMAND]", COLORS.GREEN) : ""]);
		}
		process.stdout.write(usageString + "\n\n");
		writeArray(arr)
		process.exit(0)
	}

	const obj = {
		options: (opts : {[key: string]: Option}) => {
			for (let key in opts) {
				optionList[key] = opts[key]
			}
			return obj
		},
		get args() {
			return parseArguments(argv, optionList);
		},
		option: (name: string, alias: string, def: any, desc: string, required: boolean = false, type: Type = "string") => {
			optionList[name] = {
				alias: alias,
				desc: desc,
				type: type,
				default: def,
				required: required
			}
			return obj
		},
		command: (name: string, opts: Option, callback: Function) => {
			optionList[name] = opts;
			optionList[name].callback = callback
		},
		usage: (usage: string) => {
			usageString = usage;
			return obj
		},
		set: (optionName: string, value: boolean | string | number) => {
			parserOptions[optionName] = value;
			return obj
		},
		help: function() {
			this.command("help", {alias: "h", desc: "Displays this message and exits."}, () => {
				generateHelp();
			})
			return obj;
		}
	}

	return Object.freeze(obj);
}

export {cArgs, COLORS, color}
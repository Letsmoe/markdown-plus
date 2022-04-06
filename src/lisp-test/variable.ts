class Variable {
	public immutable: boolean = false;
	constructor(public name: string, private _value: any) {}

	valueOf(): any {
		return this._value;
	}

	toString(): string {
		return this._value.toString();
	}

	setValue(value: any) {
		this._value = value;
	}
}

export { Variable };

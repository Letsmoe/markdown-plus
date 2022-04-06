class Variable {
    constructor(name, _value) {
        this.name = name;
        this._value = _value;
        this.immutable = false;
    }
    valueOf() {
        return this._value;
    }
    toString() {
        return this._value.toString();
    }
    setValue(value) {
        this._value = value;
    }
}
export { Variable };

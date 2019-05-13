import MoLangMath from "./builtins/math";

export default class MoLang {

	private variables: { [key: string]: any; } = {};

	constructor() {
		// initialize builtin variables
		this.setBuiltin("Math", new MoLangMath());
	}

	getVariable(name: string): any {
		return this.variables[name];
	}

	setVariable(name: string, value: number): number {
		if (typeof this.variables[name] !== 'number') throw new TypeError('variable is not numeric');
		return this.variables[name] = value;
	}

	private setBuiltin(name: string, value: any) {
		this.variables[name] = value;
	}

}
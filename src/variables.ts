import {VariableAccess} from "./grammar/instructions";
import {nameRegex} from "./grammar/lexer";

export type VarMap = { [key: string]: Variable<any>; };

function checkVariableName(name: string) {
	const r = nameRegex.exec(name);
	let valid = false;
	if (r !== null && r.length > 0) {
		valid = r[0].length === name.length;
	}

	if (!valid) {
		throw new Error(`Invalid variable name: ${name}`);
	}
}

export abstract class Variable<T> {
	abstract get(): T;

	abstract set(value: T);
}

export class PrimitiveVariable<T> extends Variable<T> {
	private value: T;

	constructor(value: T) {
		super();
		this.value = value;
	}

	get(): T {
		return this.value;
	}

	set(value: T) {
		this.value = value;
	}
}

export class FloatVariable extends PrimitiveVariable<number> {
}

export class ReadonlyFloatVariable extends FloatVariable {
	set(value: number): void {
		throw new Error("Variable is read-only");
	}
}

export class ObjectVariable extends Variable<any> {

	private object: VarMap;

	constructor(object: VarMap) {
		super();
		this.object = object;
	}

	get(): any {
		throw new Error("Object can't be used as value")
	}

	set(value: any) {
		throw new Error("Object can't be assigned directly")
	}

	getMember(name: string): Variable<any> | undefined {
		checkVariableName(name);
		return this.object[name];
	}

	setMember(name: string, value: Variable<any>) {
		checkVariableName(name);
		this.object[name] = value;
	}

	clear() {
		this.object = {};
	}
}

export class ReadonlyObjectVariable extends ObjectVariable {
	setMember(name: string, value: Variable<any>) {
		throw new Error("Object is read-only");
	}

	clear() {
		throw new Error("Object is read-only");
	}
}

export class FunctionVariable extends Variable<any> {

	private readonly fn: Function;

	constructor(fn: Function) {
		super();
		this.fn = fn;
	}

	get(): any {
		throw new Error("Function can't be used as value")
	}

	set(value: any) {
		throw new Error("Function can't be assigned to")
	}

	call(...params: any[]): any {
		return this.fn(...params);
	}
}

/**
 * A member variable that can be assigned to,
 * but not read from, as it doesn't exist yet.
 */
export class UndefinedMember extends Variable<any> {

	private readonly parent: ObjectVariable;
	private readonly name: string;

	constructor(parent: ObjectVariable, name: string) {
		super();
		this.parent = parent;
		this.name = name;
	}

	get(): any {
		throw new Error(`Object does not have a member named "${name}"`);
	}

	set(value: any) {
		if (typeof value !== "number") {
			throw new TypeError("Only numeric values can be assigned to a variable");
		}

		this.parent.setMember(this.name, new FloatVariable(value));
	}
}

function variableAccess(name: string): VariableAccess {
	return new VariableAccess(name, new VariableAccess("variable"));
}

/**
 * Handles all variables of a MoLang instance.
 */
export default class Variables {

	/**
	 * Built-in top-level variables that are read-only.
	 */
	private readonly builtins: VarMap;

	/**
	 * Variables that are stored persistently.
	 */
	private readonly variables: ObjectVariable;

	/**
	 * Temporary variables that are reset after evaluating each expression.
	 */
	private readonly temp: ObjectVariable;

	constructor(variables: VarMap, builtins: VarMap) {
		this.variables = new ObjectVariable(variables);
		this.builtins = builtins;
		this.temp = new ObjectVariable({});
	}

	/**
	 * Retrieves the value of a variable.
	 * @param   {string} name   The name of the variable. Must not include the `variable.` prefix.
	 * @returns                 The value of the variable. undefined if no variable with this name exists.
	 */
	getVariable(name: string): any {
		const v = this.resolveVariableAccess(variableAccess(name));
		return v.get();
	}

	/**
	 * Sets the value of a variable.
	 * @param {string} name     The name of the variable. Must not include the `variable.` prefix.
	 * @param {any}    value    The value to assign.
	 */
	setVariable(name: string, value: any) {
		const v = this.resolveVariableAccess(variableAccess(name));
		v.set(value);
	}

	/**
	 * Clears all temporary variables.
	 */
	resetTempVariables() {
		this.temp.clear();
	}

	resolveVariableAccess(v: VariableAccess): Variable<any> {
		if (v.parent === null) {
			// access to a top-level variable is requested -
			// check all available domains and built-ins

			// domain names are case insensitive
			const domain = v.name.toLowerCase();
			checkVariableName(domain);

			switch (domain) {
				case "temp":
					return this.temp;

				case "variable":
					return this.variables;

				default:
					// look for a built-in with the name
					const builtin = this.builtins[domain];

					if (builtin === undefined) {
						throw new ReferenceError(`Unknown domain: "${v.name}"`);
					}

					return builtin;
			}
		}

		// resolve the parent
		const parent = this.resolveVariableAccess(v.parent);

		// retrieve the variable from the parent
		if (!(parent instanceof ObjectVariable)) {
			throw new TypeError(`Trying to access a member of non-object variable "${v.name}"`);
		}

		const member = parent.getMember(v.name);
		if (member === undefined) {
			return new UndefinedMember(parent, v.name);
		}

		return member;
	}
}
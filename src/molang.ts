import nearley from 'nearley';
import * as grammar from './grammar/grammar'
import {Assignment, FloatValue, VariableAccess} from './grammar/instructions'
import Variables, {Variable, VarMap} from "./variables";
import MoLangMath from "./builtins/math";

const molangGrammar = nearley.Grammar.fromCompiled(grammar);

export default class MoLang {

	private readonly variables: Variables;

	/**
	 * Creates a new MoLang instance.
	 * @param {VarMap} variables    The variables to provide initially.
	 *                              Will be placed in the `variable` domain.
	 * @param {VarMap} builtins     Built-in variables to provide on the root level.
	 */
	constructor(variables: VarMap = {}, builtins: VarMap = {}) {
		// add builtins that are always available
		builtins["math"] = new MoLangMath();

		this.variables = new Variables(variables, builtins);
	}

	evaluate(source: string): any {
		// parse the source string
		const parser = new nearley.Parser(molangGrammar);
		parser.feed(source);
		const results = parser.finish();

		console.assert(results.length === 1, `Ambiguity in MoLang grammar definition - please report this issue! ${source}`);

		// use the expressions from the first parser result
		const expressions = results[0];

		if (expressions.length === 0) return 0;

		// evaluate each expression
		let lastResult: any;
		for (const expr of expressions) {
			lastResult = this.eval(expr);
		}

		// reset temp variables
		this.variables.resetTempVariables();

		return lastResult;
	}

	/**
	 * Retrieves the value of a variable.
	 * @param   {string} name   The name of the variable. Must not include the `variable.` prefix.
	 * @returns {number | null} The value of the variable. null if no variable with this name exists.
	 */
	getVariable(name: string): number | null {
		return this.variables.getVariable(name);
	}

	/**
	 * Sets the value of a variable.
	 * @param {string} name     The name of the variable. Must not include the `variable.` prefix.
	 * @param {number} value    The value to assign.
	 */
	setVariable(name: string, value: number) {
		this.variables.setVariable(name, value);
	}

	private eval(x: any): any {
		if (x instanceof FloatValue) {
			return x.value;
		}

		if (x instanceof VariableAccess) {
			return this.variables.resolveVariableAccess(x);
		}

		if (x instanceof Assignment) {
			const value = this.eval(x.value);
			if (typeof value !== "number") {
				throw new TypeError("Only numeric values can be assigned to variables!");
			}

			const variable = <Variable<any>> this.eval(x.variable);
			variable.set(value);

			return value;
		}
	}

}
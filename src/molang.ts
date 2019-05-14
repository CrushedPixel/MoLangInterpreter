import nearley from 'nearley';
import * as grammar from './grammar/grammar'
import {
	Addition,
	And,
	ArithmeticOperation,
	Assignment, CommaExpression,
	ConditionalExpression,
	Division,
	Eq,
	Expression,
	FloatValue,
	FunctionCall,
	Ge,
	Gt,
	Le,
	Lt,
	Minus,
	Multiplication,
	Ne,
	Not,
	Or,
	Plus,
	Subtraction,
	Unary,
	VariableAccess
} from './grammar/instructions'
import Variables, {FunctionVariable, Variable, VarMap} from "./variables";
import MoLangMath from "./builtins/math";

const molangGrammar = nearley.Grammar.fromCompiled(grammar);

/**
 * Converts a boolean into a number.
 */
function b2f(b: boolean): number {
	return b ? 1 : 0;
}

function f2b(f: number): boolean {
	return f !== 0;
}

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
		const expressions: Expression[] = results[0];

		if (expressions.length === 0) return 0;

		// evaluate each expression
		let lastResult: any;
		for (const expr of expressions) {
			lastResult = this.eval(expr, true);
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

	private eval(x: Expression, resolveVariables: boolean): any {
		if (x instanceof FloatValue) {
			return x.value;
		}

		if (x instanceof VariableAccess) {
			const variable = this.variables.resolveVariableAccess(x);
			if (!resolveVariables) {
				return variable;
			}

			return variable.get();
		}

		if (x instanceof FunctionCall) {
			const params: any[] = [];
			for (const p of x.parameters) {
				params.push(this.eval(p, true));
			}

			const func = this.eval(x.variable, false);
			if (!(func instanceof FunctionVariable)) {
				throw new Error(`Variable is not a function`);
			}

			return func.call(...params);
		}

		if (x instanceof Assignment) {
			const variable = this.eval(x.leftOperand, false);
			if (!(variable instanceof Variable)) {
				throw new Error("Left-hand side of an assignment must resolve to a variable");
			}

			const value = this.eval(x.rightOperand, true);
			variable.set(value);

			return value;
		}

		if (x instanceof ConditionalExpression) {
			const condition = this.eval(x.condition, true);
			if (typeof condition !== "number") {
				throw new Error("Conditions must be numeric");
			}

			if (f2b(condition)) {
				return this.eval(x.ifExpr, resolveVariables);
			} else {
				return this.eval(x.elseExpr, resolveVariables);
			}
		}

		if (x instanceof ArithmeticOperation) {
			const a = this.eval(x.leftOperand, true);
			const b = this.eval(x.rightOperand, true);

			if (typeof a !== "number" || typeof b !== "number") {
				throw new TypeError("Operands of arithmetic expressions must be numeric");
			}

			if (x instanceof Multiplication) {
				return a * b;
			}

			if (x instanceof Division) {
				return a / b;
			}

			if (x instanceof Addition) {
				return a + b;
			}

			if (x instanceof Subtraction) {
				return a - b;
			}

			if (x instanceof And) {
				return b2f(f2b(a) && f2b(b));
			}

			if (x instanceof Or) {
				return b2f(f2b(a) || f2b(b));
			}

			if (x instanceof Lt) {
				return b2f(a < b);
			}

			if (x instanceof Le) {
				return b2f(a <= b);
			}

			if (x instanceof Gt) {
				return b2f(a > b);
			}

			if (x instanceof Ge) {
				return b2f(a >= b);
			}

			if (x instanceof Eq) {
				return b2f(a === b);
			}

			if (x instanceof Ne) {
				return b2f(a !== b);
			}
		}

		if (x instanceof Unary) {
			const val = this.eval(x.expression, true);
			if (typeof val !== "number") {
				throw new TypeError("Operands of unary expressions must be numeric");
			}

			if (x instanceof Not) {
				return b2f(!f2b(val));
			}

			if (x instanceof Minus) {
				return -val;
			}

			if (x instanceof Plus) {
				return +val;
			}
		}

		if (x instanceof CommaExpression) {
			throw new Error("Comma not allowed here");
		}

		throw new Error(`Unknown instruction: ${x}`);
	}

}
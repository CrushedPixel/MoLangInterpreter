export interface Expression {
}

export class FloatValue implements Expression {
	readonly value: number;

	constructor(value: number) {
		this.value = value;
	}
}

export class VariableAccess implements Expression {
	readonly name: string;
	readonly parent: VariableAccess | null;

	constructor(name: string, parent: VariableAccess | null = null) {
		this.name = name;
		this.parent = parent;
	}
}

export class FunctionCall implements Expression {
	/**
	 * The variable to call as a function.
	 */
	readonly variable: Expression;
	readonly parameters: Expression[];

	constructor(variable: Expression, ...parameters: Expression[]) {
		this.variable = variable;
		this.parameters = parameters;
	}
}

abstract class Operation implements Expression {
	readonly leftOperand: Expression;
	readonly rightOperand: Expression;

	constructor(leftOperand: Expression, rightOperand: Expression) {
		this.leftOperand = leftOperand;
		this.rightOperand = rightOperand;
	}
}

export class Assignment extends Operation {
}

export class ConditionalExpression implements Expression {
	readonly condition: Expression;
	readonly ifExpr: Expression;
	readonly elseExpr: Expression;

	constructor(condition: Expression, ifExpr: Expression, elseExpr: Expression) {
		this.condition = condition;
		this.ifExpr = ifExpr;
		this.elseExpr = elseExpr;
	}
}


export abstract class ArithmeticOperation extends Operation {}

export class Multiplication extends ArithmeticOperation {
}

export class Division extends ArithmeticOperation {
}

export class Addition extends ArithmeticOperation {
}

export class Subtraction extends ArithmeticOperation {
}

export class And extends ArithmeticOperation {
}

export class Or extends ArithmeticOperation {
}

export class Lt extends ArithmeticOperation {
}

export class Le extends ArithmeticOperation {
}

export class Gt extends ArithmeticOperation {
}

export class Ge extends ArithmeticOperation {
}

export class Eq extends ArithmeticOperation {
}

export class Ne extends ArithmeticOperation {
}

export class Unary implements Expression {
	readonly expression: Expression;

	constructor(expression: Expression) {
		this.expression = expression;
	}
}

export class Not extends Unary {
}

export class Minus extends Unary {
}

export class Plus extends Unary {
}
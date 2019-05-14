interface Expression {
}

export class FloatValue implements Expression {
	readonly value: number;

	constructor(value: number) {
		this.value = value;
	}
}

export class Variable implements Expression {
	readonly name: string;
	readonly parent: Variable | null;

	constructor(name: string, parent: Variable | null = null) {
		this.name = name;
		this.parent = parent;
	}
}

export class Assignment implements Expression {
	readonly variable: Variable;
	readonly value: Expression;

	constructor(variable: Variable, value: Expression) {
		this.variable = variable;
		this.value = value;
	}
}

export class FunctionCall implements Expression {
	/**
	 * The variable to call as a function.
	 */
	readonly variable: Variable;
	readonly parameters: Expression[];

	constructor(variable: Variable, ...parameters: Expression[]) {
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

export class Multiplication extends Operation {
}

export class Division extends Operation {
}

export class Addition extends Operation {
}

export class Subtraction extends Operation {
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

export class And extends Operation {
}

export class Or extends Operation {
}

export class Lt extends Operation {
}

export class Le extends Operation {
}

export class Gt extends Operation {
}

export class Ge extends Operation {
}

export class Eq extends Operation {
}

export class Ne extends Operation {
}

class Unary implements Expression {
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
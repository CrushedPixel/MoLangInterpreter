import {expect} from 'chai';
import 'mocha';
import MoLang from '../src/molang';
import {FloatVariable} from "../src/variables";

describe('Arithmetic', () => {
	it('has the right operator precedence', () => {
		const result = new MoLang().evaluate(
			"10 + 3 * 4 - 3 * (2 + 9)");
		expect(result).to.equal(10 + 3 * 4 - 3 * (2 + 9));
	});

	it('supports arithmetic with variables', () => {
		const m = new MoLang({
			a: new FloatVariable(0.5),
		});

		const result = m.evaluate("variable.b = 2; return variable.a * Math.abs(variable.b);");
		expect(result).to.equal(1);
	});
});

describe('Function calls', () => {
	it('supports builtin functions', () => {
		const result = new MoLang().evaluate(
			"Math.sin(1)");
		expect(result).to.equal(Math.sin(1));
	});

	it('supports functions with multiple arguments', () => {
		const result = new MoLang().evaluate(
			"Math.clamp(20, 5, 10)"
		);
		expect(result).to.equal(10);
	});

	it('supports expressions as function arguments', () => {
		new MoLang().evaluate(
			"Math.random(Math.random(-1, 1) > 0 ? 10 : -10, 15)"
		);
	});

	it('supports calling expressions that return functions', () => {
		const m = new MoLang({
			random: new FloatVariable(Math.random())
		});
		const result = m.evaluate(
			"(variable.random > 0.5 ? Math.sin : Math.cos)(0)"
		);

		expect(result).to.equal(((<FloatVariable>m.getVariable("random")).get() > 0.5 ? Math.sin : Math.cos)(0));
	});
});

describe('Assignment', () => {
	it('correctly resolves expressions that return variables', () => {
		const m = new MoLang({
			x: new FloatVariable(0),
			y: new FloatVariable(0)
		});
		m.evaluate(
			"10 + 3 > 10 ? variable.x : variable.y = 1;"
		);

		expect((<FloatVariable>m.getVariable("x")).get()).to.equal(1);
		expect((<FloatVariable>m.getVariable("y")).get()).to.equal(0);
	});

	it('correctly assigns to new variables', () => {
		const m = new MoLang({
			random: new FloatVariable(Math.random())
		});
		m.evaluate(`
			variable.x = 1;
			variable.y = variable.random;
			return 0;
		`);

		expect((<FloatVariable>m.getVariable("x")).get()).to.equal(1);
		expect((<FloatVariable>m.getVariable("y")).get()).to.equal((<FloatVariable>m.getVariable("random")).get());
	});

	it('correctly uses variables that were assigned in a previous script', () => {
		const m = new MoLang();
		m.evaluate("variable.a = 10; variable.b = 2;");
		const result = m.evaluate("variable.a * variable.b");

		expect(result).to.equal(20);
	});

	it('allows single-assignment expressions', () => {
		const m = new MoLang();
		m.evaluate("variable.a = 10;");

		expect((<FloatVariable>m.getVariable("a")).get()).to.equal(10);
	});

	it('disallows variable assignments not followed by a semicolon', () => {
		const m = new MoLang();
		const src = "variable.a = 10";
		expect(() => {
			m.evaluate(src)
		}).to.throw(`Invalid source string: ${src}`);
	});
});

describe('Complex expressions', () => {
	it('correctly uses temporary variables', () => {
		const m = new MoLang({
			random_1: new FloatVariable(Math.random()),
			random_2: new FloatVariable(Math.random())
		});

		const result = m.evaluate(`
			temp.sign = variable.random_1 > 0.5 ? 1 : -1;
			return temp.sign * Math.sin(variable.random_2);
		`);

		const sign = (<FloatVariable>m.getVariable("random_1")).get() > 0.5 ? 1 : -1;
		const expected = sign * Math.sin((<FloatVariable>m.getVariable("random_2")).get());

		expect(result).to.equal(expected);
	});
});
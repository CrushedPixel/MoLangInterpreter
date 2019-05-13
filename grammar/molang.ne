@preprocessor typescript

@{%
import {
    FloatValue,

    Variable,
    Assignment,
    FunctionCall,

    Multiplication,
    Division,
    Addition,
    Subtraction,

    ConditionalExpression,

    And,
    Or,
    Lt,
    Le,
    Gt,
    Ge,
    Eq,
    Ne,

    Not
} from './instructions';

import moo from 'moo';

const syntax = [
	// brackets
	'(', ')', '[', ']', '{', '}',

	',', '.', ';',

	// arithmetic operators
	'*', '/', '+', '-',

	// comparison operators
	'!', '&&', '||', '<', '<=', '>=', '>', '==', '!=',

	// misc
	'=', '?', ':'
];

const lexer = moo.compile({
	// whitespace
	ws: /[ \t]+/,
	nl: {match: /\n/, lineBreaks: true},

	// an integer or floating-point number
	number: /(?:[0-9]*[.])?[0-9]+/,

	// a variable name
	name: /[a-zA-Z_](?:\w)*/,

	syntax: syntax,
});

// don't emit whitespace tokens
lexer.next = (next => () => {
    let tok;
    while ((tok = next.call(lexer)) && ["ws", "nl"].includes(tok.type)) {}
    return tok;
})(lexer.next);

const first = ([fst]) => fst;
%}

@lexer lexer

# macro for syntax elements that should just emit null
S[content] -> $content {% () => null %}

# Script creates an array of expressions to execute.
Script ->
    ComplexExpression {% first %}
  | Expression        {% (data) => [data] %}

# In a multi-expression script,
# all but the last expression
# must assign a value to a variable.
# The last expression can as well,
# but doesn't need to as its value
# is assumed to be used as the return value.
ComplexExpression ->
    (((Assignment):? S[";"]):+ ReturnExpression) S[";"]
    {%
    (data) => {
        const expressions = [];

        const [pairs, lastExpression] = data[0];
        for (const pair of pairs) {
            if (pair[0] === null) continue;
            expressions.push(pair[0][0]);
        }

        expressions.push(lastExpression);
        return expressions;
    }
    %}

Expression ->
    ArithmeticExpression  {% first %}
  | ConditionalExpression {% first %}
  | BooleanExpression     {% first %}
  | Assignment            {% first %}
  | FunctionCall          {% first %}
  | FloatValue            {% first %}
  | Variable              {% first %}

ReturnExpression ->
    S["return"] Expression
    {% (data) => data[1] %}

FloatValue ->
    %number
    {% ([val]) => new FloatValue(parseFloat(val.value)) %}

# arithmetic operations
ArithmeticExpression ->
    Expression S["*"] Expression {% (data) => new Multiplication(data[0], data[2]) %}
  | Expression S["/"] Expression {% (data) => new Division(data[0], data[2]) %}
  | Expression S["+"] Expression {% (data) => new Addition(data[0], data[2]) %}
  | Expression S["-"] Expression {% (data) => new Subtraction(data[0], data[2]) %}

ConditionalExpression ->
    Expression S["?"] Expression S[":"] Expression
    {% (data) => new ConditionalExpression(data[0], data[2], data[4]) %}

# boolean operations
BooleanExpression ->
    S["!"] Expression {% (data) => new Not(data[1]) %}
  | Expression S["&&"] Expression {% (data) => new And(data[0], data[2]) %}
  | Expression S["||"] Expression {% (data) => new Or(data[0], data[2]) %}
  | Expression S["<"] Expression {% (data) => new Lt(data[0], data[2]) %}
  | Expression S["<="] Expression {% (data) => new Le(data[0], data[2]) %}
  | Expression S[">"] Expression {% (data) => new Gt(data[0], data[2]) %}
  | Expression S[">="] Expression {% (data) => new Ge(data[0], data[2]) %}
  | Expression S["=="] Expression {% (data) => new Eq(data[0], data[2]) %}
  | Expression S["!="] Expression {% (data) => new Ne(data[0], data[2]) %}

# variable assignment
Assignment ->
    Variable S["="] Expression
    {% (data) => new Assignment(data[0], data[2]) %}

Variable ->
    %name {% (data) => new Variable(data[0].value) %}
  | MemberAccess {% first %}

# variable member access
MemberAccess ->
    Variable S["."] %name
    {% (data) => new Variable(data[2].value, data[0]) %}

# variable function call with zero or more parameters
FunctionCall ->
    Variable S["("] ((Expression S[","]):* Expression):? S[")"]
    {%
    (data) => {
        const func = data[0];

        const params = [];
        const paramGroup = data[2];
        if (paramGroup !== null) {
            const [pairs, lastExpression] = paramGroup;

            // each pair consists of an expression and the comma
            for (const pair of pairs) {
                params.push(pair[0]);
            }

            params.push(lastExpression);
        }

        return new FunctionCall(func, ...params);
    }
    %}
@preprocessor typescript

@{%
import {
    Expression,
    CommaExpression,

    FloatValue,

    VariableAccess,
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

    Not,
    Minus,
    Plus
} from './instructions';

import lexer from './lexer'

// don't emit whitespace tokens
lexer.next = (next => () => {
    let tok;
    while ((tok = next.call(lexer)) && ["ws", "nl"].includes(tok.type)) {}
    return tok;
})(lexer.next);

const first = ([fst]) => fst;

function unpackCommaExpression(expr: CommaExpression): Expression[] {
    let results: Expression[] = [];
    for (const operand of [expr.leftOperand, expr.rightOperand]) {
        if (operand instanceof CommaExpression) {
            results = results.concat(unpackCommaExpression(operand));
        } else {
            results.push(operand);
        }
    }

    return results;
}
%}

@lexer lexer

# Script creates an array of expressions to execute.
Script ->
    ComplexExpression {% first %}
  | Expression        {% (data) => data %}

# In a multi-expression script,
# all but the last expression
# must assign a value to a variable.
# The last expression can as well,
# but doesn't need to as its value
# is assumed to be used as the return value.
ComplexExpression ->
    (((ExpAssignment):? ";"):+ (ReturnExpression):?) (";"):?
    {%
    (data) => {
        const expressions: any[] = [];

        const [pairs, lastExpression] = data[0];
        for (const pair of pairs) {
            if (pair[0] === null) continue;
            expressions.push(pair[0][0]);
        }

        // the return expression is optional
        if (lastExpression !== null) {
            expressions.push(lastExpression[0]);
        }

        return expressions;
    }
    %}

# Expressions

Expression -> ExpComma {% first %}

ExpComma ->
    ExpComma "," ExpAssignment {% (data) => new CommaExpression(data[0], data[2]) %}
  | ExpAssignment {% first %}

ExpAssignment ->
    ExpAssignment "=" ExpConditional {% (data) => new Assignment(data[0], data[2]) %}
  | ExpConditional {% first %}

ExpConditional ->
    ExpConditional "?" ExpOr ":" ExpOr {% (data) => new ConditionalExpression(data[0], data[2], data[4]) %}
  | ExpOr {% first %}

ExpOr ->
    ExpOr "||" ExpAnd {% (data) => new Or(data[0], data[2]) %}
  | ExpAnd {% first %}

ExpAnd ->
    ExpAnd "&&" ExpAnd {% (data) => new And(data[0], data[2]) %}
  | ExpComparison {% first %}

ExpComparison ->
    ExpComparison "==" ExpRelational {% (data) => new Eq(data[0], data[2]) %}
  | ExpComparison "!=" ExpRelational {% (data) => new Ne(data[0], data[2]) %}
  | ExpRelational {% first %}

ExpRelational ->
    ExpRelational "<" ExpSum {% (data) => new Lt(data[0], data[2]) %}
  | ExpRelational "<=" ExpSum {% (data) => new Le(data[0], data[2]) %}
  | ExpRelational ">" ExpSum {% (data) => new Gt(data[0], data[2]) %}
  | ExpRelational ">=" ExpSum {% (data) => new Ge(data[0], data[2]) %}
  | ExpSum {% first %}

ExpSum ->
    ExpSum "+" ExpProduct {% (data) => new Addition(data[0], data[2]) %}
  | ExpSum "-" ExpProduct {% (data) => new Subtraction(data[0], data[2]) %}
  | ExpProduct {% first %}

ExpProduct ->
    ExpProduct "*" ExpUnary {% (data) => new Multiplication(data[0], data[2]) %}
  | ExpProduct "/" ExpUnary {% (data) => new Division(data[0], data[2]) %}
  | ExpUnary {% first %}

ExpUnary ->
    "!" ExpCall {% (data) => new Not(data[1]) %}
  | "-" ExpCall {% (data) => new Minus(data[1]) %}
  | "+" ExpCall {% (data) => new Plus(data[1]) %}
  | ExpCall {% first %}

# function call with zero or more parameters
ExpCall ->
    ExpCall "(" (Expression):? ")"
    {%
    (data) => {
        const func = data[0];

        let params: any[] = [];
        const paramGroup = data[2];
        if (paramGroup !== null) {
            // unpack possibly comma-separated arguments
            for (const expr of paramGroup) {
                if (expr instanceof CommaExpression) {
                    params = params.concat(unpackCommaExpression(expr));
                } else {
                    params.push(expr);
                }
            }
        }

        return new FunctionCall(func, ...params);
    }
    %}
  | Atom {% first %}

Atom ->
    Number          {% first %}
  | Parenthesized   {% first %}
  | Variable        {% first %}

Number ->
    %number
    {% ([val]) => new FloatValue(parseFloat(val.value)) %}

Parenthesized -> "(" Expression ")" {% (data) => data[1] %}

ReturnExpression ->
    "return" Expression
    {% (data) => data[1] %}

Variable ->
    %name {% (data) => new VariableAccess(data[0].value) %}
  | MemberAccess {% first %}

# variable member access
MemberAccess ->
    Variable "." %name
    {% (data) => new VariableAccess(data[2].value, data[0]) %}
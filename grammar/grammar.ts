// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var number: any;
declare var name: any;

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

export interface Token { value: any; [key: string]: any };

export interface Lexer {
  reset: (chunk: string, info: any) => void;
  next: () => Token | undefined;
  save: () => any;
  formatError: (token: Token) => string;
  has: (tokenType: string) => boolean
};

export interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any
};

export type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

export var Lexer: Lexer | undefined = lexer;

export var ParserRules: NearleyRule[] = [
    {"name": "Script", "symbols": ["ComplexExpression"], "postprocess": first},
    {"name": "Script", "symbols": ["Expression"], "postprocess": (data) => [data]},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["Assignment"]},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["ComplexExpression$subexpression$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$1$macrocall$2", "symbols": [{"literal":";"}]},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$1$macrocall$1", "symbols": ["ComplexExpression$subexpression$1$ebnf$1$subexpression$1$macrocall$2"], "postprocess": () => null},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$1", "symbols": ["ComplexExpression$subexpression$1$ebnf$1$subexpression$1$ebnf$1", "ComplexExpression$subexpression$1$ebnf$1$subexpression$1$macrocall$1"]},
    {"name": "ComplexExpression$subexpression$1$ebnf$1", "symbols": ["ComplexExpression$subexpression$1$ebnf$1$subexpression$1"]},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$2$ebnf$1$subexpression$1", "symbols": ["Assignment"]},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$2$ebnf$1", "symbols": ["ComplexExpression$subexpression$1$ebnf$1$subexpression$2$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$2$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$2$macrocall$2", "symbols": [{"literal":";"}]},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$2$macrocall$1", "symbols": ["ComplexExpression$subexpression$1$ebnf$1$subexpression$2$macrocall$2"], "postprocess": () => null},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$2", "symbols": ["ComplexExpression$subexpression$1$ebnf$1$subexpression$2$ebnf$1", "ComplexExpression$subexpression$1$ebnf$1$subexpression$2$macrocall$1"]},
    {"name": "ComplexExpression$subexpression$1$ebnf$1", "symbols": ["ComplexExpression$subexpression$1$ebnf$1", "ComplexExpression$subexpression$1$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "ComplexExpression$subexpression$1", "symbols": ["ComplexExpression$subexpression$1$ebnf$1", "ReturnExpression"]},
    {"name": "ComplexExpression$macrocall$2", "symbols": [{"literal":";"}]},
    {"name": "ComplexExpression$macrocall$1", "symbols": ["ComplexExpression$macrocall$2"], "postprocess": () => null},
    {"name": "ComplexExpression", "symbols": ["ComplexExpression$subexpression$1", "ComplexExpression$macrocall$1"], "postprocess": 
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
        },
    {"name": "Expression", "symbols": ["ArithmeticExpression"], "postprocess": first},
    {"name": "Expression", "symbols": ["ConditionalExpression"], "postprocess": first},
    {"name": "Expression", "symbols": ["BooleanExpression"], "postprocess": first},
    {"name": "Expression", "symbols": ["Assignment"], "postprocess": first},
    {"name": "Expression", "symbols": ["FunctionCall"], "postprocess": first},
    {"name": "Expression", "symbols": ["FloatValue"], "postprocess": first},
    {"name": "Expression", "symbols": ["Variable"], "postprocess": first},
    {"name": "ReturnExpression$macrocall$2", "symbols": [{"literal":"return"}]},
    {"name": "ReturnExpression$macrocall$1", "symbols": ["ReturnExpression$macrocall$2"], "postprocess": () => null},
    {"name": "ReturnExpression", "symbols": ["ReturnExpression$macrocall$1", "Expression"], "postprocess": (data) => data[1]},
    {"name": "FloatValue", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([val]) => new FloatValue(parseFloat(val.value))},
    {"name": "ArithmeticExpression$macrocall$2", "symbols": [{"literal":"*"}]},
    {"name": "ArithmeticExpression$macrocall$1", "symbols": ["ArithmeticExpression$macrocall$2"], "postprocess": () => null},
    {"name": "ArithmeticExpression", "symbols": ["Expression", "ArithmeticExpression$macrocall$1", "Expression"], "postprocess": (data) => new Multiplication(data[0], data[2])},
    {"name": "ArithmeticExpression$macrocall$4", "symbols": [{"literal":"/"}]},
    {"name": "ArithmeticExpression$macrocall$3", "symbols": ["ArithmeticExpression$macrocall$4"], "postprocess": () => null},
    {"name": "ArithmeticExpression", "symbols": ["Expression", "ArithmeticExpression$macrocall$3", "Expression"], "postprocess": (data) => new Division(data[0], data[2])},
    {"name": "ArithmeticExpression$macrocall$6", "symbols": [{"literal":"+"}]},
    {"name": "ArithmeticExpression$macrocall$5", "symbols": ["ArithmeticExpression$macrocall$6"], "postprocess": () => null},
    {"name": "ArithmeticExpression", "symbols": ["Expression", "ArithmeticExpression$macrocall$5", "Expression"], "postprocess": (data) => new Addition(data[0], data[2])},
    {"name": "ArithmeticExpression$macrocall$8", "symbols": [{"literal":"-"}]},
    {"name": "ArithmeticExpression$macrocall$7", "symbols": ["ArithmeticExpression$macrocall$8"], "postprocess": () => null},
    {"name": "ArithmeticExpression", "symbols": ["Expression", "ArithmeticExpression$macrocall$7", "Expression"], "postprocess": (data) => new Subtraction(data[0], data[2])},
    {"name": "ConditionalExpression$macrocall$2", "symbols": [{"literal":"?"}]},
    {"name": "ConditionalExpression$macrocall$1", "symbols": ["ConditionalExpression$macrocall$2"], "postprocess": () => null},
    {"name": "ConditionalExpression$macrocall$4", "symbols": [{"literal":":"}]},
    {"name": "ConditionalExpression$macrocall$3", "symbols": ["ConditionalExpression$macrocall$4"], "postprocess": () => null},
    {"name": "ConditionalExpression", "symbols": ["Expression", "ConditionalExpression$macrocall$1", "Expression", "ConditionalExpression$macrocall$3", "Expression"], "postprocess": (data) => new ConditionalExpression(data[0], data[2], data[4])},
    {"name": "BooleanExpression$macrocall$2", "symbols": [{"literal":"!"}]},
    {"name": "BooleanExpression$macrocall$1", "symbols": ["BooleanExpression$macrocall$2"], "postprocess": () => null},
    {"name": "BooleanExpression", "symbols": ["BooleanExpression$macrocall$1", "Expression"], "postprocess": (data) => new Not(data[1])},
    {"name": "BooleanExpression$macrocall$4", "symbols": [{"literal":"&&"}]},
    {"name": "BooleanExpression$macrocall$3", "symbols": ["BooleanExpression$macrocall$4"], "postprocess": () => null},
    {"name": "BooleanExpression", "symbols": ["Expression", "BooleanExpression$macrocall$3", "Expression"], "postprocess": (data) => new And(data[0], data[2])},
    {"name": "BooleanExpression$macrocall$6", "symbols": [{"literal":"||"}]},
    {"name": "BooleanExpression$macrocall$5", "symbols": ["BooleanExpression$macrocall$6"], "postprocess": () => null},
    {"name": "BooleanExpression", "symbols": ["Expression", "BooleanExpression$macrocall$5", "Expression"], "postprocess": (data) => new Or(data[0], data[2])},
    {"name": "BooleanExpression$macrocall$8", "symbols": [{"literal":"<"}]},
    {"name": "BooleanExpression$macrocall$7", "symbols": ["BooleanExpression$macrocall$8"], "postprocess": () => null},
    {"name": "BooleanExpression", "symbols": ["Expression", "BooleanExpression$macrocall$7", "Expression"], "postprocess": (data) => new Lt(data[0], data[2])},
    {"name": "BooleanExpression$macrocall$10", "symbols": [{"literal":"<="}]},
    {"name": "BooleanExpression$macrocall$9", "symbols": ["BooleanExpression$macrocall$10"], "postprocess": () => null},
    {"name": "BooleanExpression", "symbols": ["Expression", "BooleanExpression$macrocall$9", "Expression"], "postprocess": (data) => new Le(data[0], data[2])},
    {"name": "BooleanExpression$macrocall$12", "symbols": [{"literal":">"}]},
    {"name": "BooleanExpression$macrocall$11", "symbols": ["BooleanExpression$macrocall$12"], "postprocess": () => null},
    {"name": "BooleanExpression", "symbols": ["Expression", "BooleanExpression$macrocall$11", "Expression"], "postprocess": (data) => new Gt(data[0], data[2])},
    {"name": "BooleanExpression$macrocall$14", "symbols": [{"literal":">="}]},
    {"name": "BooleanExpression$macrocall$13", "symbols": ["BooleanExpression$macrocall$14"], "postprocess": () => null},
    {"name": "BooleanExpression", "symbols": ["Expression", "BooleanExpression$macrocall$13", "Expression"], "postprocess": (data) => new Ge(data[0], data[2])},
    {"name": "BooleanExpression$macrocall$16", "symbols": [{"literal":"=="}]},
    {"name": "BooleanExpression$macrocall$15", "symbols": ["BooleanExpression$macrocall$16"], "postprocess": () => null},
    {"name": "BooleanExpression", "symbols": ["Expression", "BooleanExpression$macrocall$15", "Expression"], "postprocess": (data) => new Eq(data[0], data[2])},
    {"name": "BooleanExpression$macrocall$18", "symbols": [{"literal":"!="}]},
    {"name": "BooleanExpression$macrocall$17", "symbols": ["BooleanExpression$macrocall$18"], "postprocess": () => null},
    {"name": "BooleanExpression", "symbols": ["Expression", "BooleanExpression$macrocall$17", "Expression"], "postprocess": (data) => new Ne(data[0], data[2])},
    {"name": "Assignment$macrocall$2", "symbols": [{"literal":"="}]},
    {"name": "Assignment$macrocall$1", "symbols": ["Assignment$macrocall$2"], "postprocess": () => null},
    {"name": "Assignment", "symbols": ["Variable", "Assignment$macrocall$1", "Expression"], "postprocess": (data) => new Assignment(data[0], data[2])},
    {"name": "Variable", "symbols": [(lexer.has("name") ? {type: "name"} : name)], "postprocess": (data) => new Variable(data[0].value)},
    {"name": "Variable", "symbols": ["MemberAccess"], "postprocess": first},
    {"name": "MemberAccess$macrocall$2", "symbols": [{"literal":"."}]},
    {"name": "MemberAccess$macrocall$1", "symbols": ["MemberAccess$macrocall$2"], "postprocess": () => null},
    {"name": "MemberAccess", "symbols": ["Variable", "MemberAccess$macrocall$1", (lexer.has("name") ? {type: "name"} : name)], "postprocess": (data) => new Variable(data[2].value, data[0])},
    {"name": "FunctionCall$macrocall$2", "symbols": [{"literal":"("}]},
    {"name": "FunctionCall$macrocall$1", "symbols": ["FunctionCall$macrocall$2"], "postprocess": () => null},
    {"name": "FunctionCall$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "FunctionCall$ebnf$1$subexpression$1$ebnf$1$subexpression$1$macrocall$2", "symbols": [{"literal":","}]},
    {"name": "FunctionCall$ebnf$1$subexpression$1$ebnf$1$subexpression$1$macrocall$1", "symbols": ["FunctionCall$ebnf$1$subexpression$1$ebnf$1$subexpression$1$macrocall$2"], "postprocess": () => null},
    {"name": "FunctionCall$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["Expression", "FunctionCall$ebnf$1$subexpression$1$ebnf$1$subexpression$1$macrocall$1"]},
    {"name": "FunctionCall$ebnf$1$subexpression$1$ebnf$1", "symbols": ["FunctionCall$ebnf$1$subexpression$1$ebnf$1", "FunctionCall$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "FunctionCall$ebnf$1$subexpression$1", "symbols": ["FunctionCall$ebnf$1$subexpression$1$ebnf$1", "Expression"]},
    {"name": "FunctionCall$ebnf$1", "symbols": ["FunctionCall$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "FunctionCall$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "FunctionCall$macrocall$4", "symbols": [{"literal":")"}]},
    {"name": "FunctionCall$macrocall$3", "symbols": ["FunctionCall$macrocall$4"], "postprocess": () => null},
    {"name": "FunctionCall", "symbols": ["Variable", "FunctionCall$macrocall$1", "FunctionCall$ebnf$1", "FunctionCall$macrocall$3"], "postprocess": 
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
        }
];

export var ParserStart: string = "Script";

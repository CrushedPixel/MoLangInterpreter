// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var number: any;
declare var name: any;

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
    {"name": "Script", "symbols": ["Expression"], "postprocess": (data) => data},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["ExpAssignment"]},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["ComplexExpression$subexpression$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$1", "symbols": ["ComplexExpression$subexpression$1$ebnf$1$subexpression$1$ebnf$1", {"literal":";"}]},
    {"name": "ComplexExpression$subexpression$1$ebnf$1", "symbols": ["ComplexExpression$subexpression$1$ebnf$1$subexpression$1"]},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$2$ebnf$1$subexpression$1", "symbols": ["ExpAssignment"]},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$2$ebnf$1", "symbols": ["ComplexExpression$subexpression$1$ebnf$1$subexpression$2$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$2$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "ComplexExpression$subexpression$1$ebnf$1$subexpression$2", "symbols": ["ComplexExpression$subexpression$1$ebnf$1$subexpression$2$ebnf$1", {"literal":";"}]},
    {"name": "ComplexExpression$subexpression$1$ebnf$1", "symbols": ["ComplexExpression$subexpression$1$ebnf$1", "ComplexExpression$subexpression$1$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "ComplexExpression$subexpression$1$ebnf$2$subexpression$1", "symbols": ["ReturnExpression"]},
    {"name": "ComplexExpression$subexpression$1$ebnf$2", "symbols": ["ComplexExpression$subexpression$1$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "ComplexExpression$subexpression$1$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "ComplexExpression$subexpression$1", "symbols": ["ComplexExpression$subexpression$1$ebnf$1", "ComplexExpression$subexpression$1$ebnf$2"]},
    {"name": "ComplexExpression$ebnf$1$subexpression$1", "symbols": [{"literal":";"}]},
    {"name": "ComplexExpression$ebnf$1", "symbols": ["ComplexExpression$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "ComplexExpression$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "ComplexExpression", "symbols": ["ComplexExpression$subexpression$1", "ComplexExpression$ebnf$1"], "postprocess": 
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
        },
    {"name": "Expression", "symbols": ["ExpComma"], "postprocess": first},
    {"name": "ExpComma", "symbols": ["ExpComma", {"literal":","}, "ExpAssignment"], "postprocess": (data) => new CommaExpression(data[0], data[2])},
    {"name": "ExpComma", "symbols": ["ExpAssignment"], "postprocess": first},
    {"name": "ExpAssignment", "symbols": ["ExpAssignment", {"literal":"="}, "ExpConditional"], "postprocess": (data) => new Assignment(data[0], data[2])},
    {"name": "ExpAssignment", "symbols": ["ExpConditional"], "postprocess": first},
    {"name": "ExpConditional", "symbols": ["ExpConditional", {"literal":"?"}, "ExpOr", {"literal":":"}, "ExpOr"], "postprocess": (data) => new ConditionalExpression(data[0], data[2], data[4])},
    {"name": "ExpConditional", "symbols": ["ExpOr"], "postprocess": first},
    {"name": "ExpOr", "symbols": ["ExpOr", {"literal":"||"}, "ExpAnd"], "postprocess": (data) => new Or(data[0], data[2])},
    {"name": "ExpOr", "symbols": ["ExpAnd"], "postprocess": first},
    {"name": "ExpAnd", "symbols": ["ExpAnd", {"literal":"&&"}, "ExpAnd"], "postprocess": (data) => new And(data[0], data[2])},
    {"name": "ExpAnd", "symbols": ["ExpComparison"], "postprocess": first},
    {"name": "ExpComparison", "symbols": ["ExpComparison", {"literal":"=="}, "ExpRelational"], "postprocess": (data) => new Eq(data[0], data[2])},
    {"name": "ExpComparison", "symbols": ["ExpComparison", {"literal":"!="}, "ExpRelational"], "postprocess": (data) => new Ne(data[0], data[2])},
    {"name": "ExpComparison", "symbols": ["ExpRelational"], "postprocess": first},
    {"name": "ExpRelational", "symbols": ["ExpRelational", {"literal":"<"}, "ExpSum"], "postprocess": (data) => new Lt(data[0], data[2])},
    {"name": "ExpRelational", "symbols": ["ExpRelational", {"literal":"<="}, "ExpSum"], "postprocess": (data) => new Le(data[0], data[2])},
    {"name": "ExpRelational", "symbols": ["ExpRelational", {"literal":">"}, "ExpSum"], "postprocess": (data) => new Gt(data[0], data[2])},
    {"name": "ExpRelational", "symbols": ["ExpRelational", {"literal":">="}, "ExpSum"], "postprocess": (data) => new Ge(data[0], data[2])},
    {"name": "ExpRelational", "symbols": ["ExpSum"], "postprocess": first},
    {"name": "ExpSum", "symbols": ["ExpSum", {"literal":"+"}, "ExpProduct"], "postprocess": (data) => new Addition(data[0], data[2])},
    {"name": "ExpSum", "symbols": ["ExpSum", {"literal":"-"}, "ExpProduct"], "postprocess": (data) => new Subtraction(data[0], data[2])},
    {"name": "ExpSum", "symbols": ["ExpProduct"], "postprocess": first},
    {"name": "ExpProduct", "symbols": ["ExpProduct", {"literal":"*"}, "ExpUnary"], "postprocess": (data) => new Multiplication(data[0], data[2])},
    {"name": "ExpProduct", "symbols": ["ExpProduct", {"literal":"/"}, "ExpUnary"], "postprocess": (data) => new Division(data[0], data[2])},
    {"name": "ExpProduct", "symbols": ["ExpUnary"], "postprocess": first},
    {"name": "ExpUnary", "symbols": [{"literal":"!"}, "ExpCall"], "postprocess": (data) => new Not(data[1])},
    {"name": "ExpUnary", "symbols": [{"literal":"-"}, "ExpCall"], "postprocess": (data) => new Minus(data[1])},
    {"name": "ExpUnary", "symbols": [{"literal":"+"}, "ExpCall"], "postprocess": (data) => new Plus(data[1])},
    {"name": "ExpUnary", "symbols": ["ExpCall"], "postprocess": first},
    {"name": "ExpCall$ebnf$1$subexpression$1", "symbols": ["Expression"]},
    {"name": "ExpCall$ebnf$1", "symbols": ["ExpCall$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "ExpCall$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "ExpCall", "symbols": ["ExpCall", {"literal":"("}, "ExpCall$ebnf$1", {"literal":")"}], "postprocess": 
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
        },
    {"name": "ExpCall", "symbols": ["Atom"], "postprocess": first},
    {"name": "Atom", "symbols": ["Number"], "postprocess": first},
    {"name": "Atom", "symbols": ["Parenthesized"], "postprocess": first},
    {"name": "Atom", "symbols": ["Variable"], "postprocess": first},
    {"name": "Number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([val]) => new FloatValue(parseFloat(val.value))},
    {"name": "Parenthesized", "symbols": [{"literal":"("}, "Expression", {"literal":")"}], "postprocess": (data) => data[1]},
    {"name": "ReturnExpression", "symbols": [{"literal":"return"}, "Expression"], "postprocess": (data) => data[1]},
    {"name": "Variable", "symbols": [(lexer.has("name") ? {type: "name"} : name)], "postprocess": (data) => new VariableAccess(data[0].value)},
    {"name": "Variable", "symbols": ["MemberAccess"], "postprocess": first},
    {"name": "MemberAccess", "symbols": ["Variable", {"literal":"."}, (lexer.has("name") ? {type: "name"} : name)], "postprocess": (data) => new VariableAccess(data[2].value, data[0])}
];

export var ParserStart: string = "Script";

import moo from 'moo';

const syntax = [
	// brackets
	'(', ')', '[', ']',

	',', '.', ';',

	// arithmetic operators
	'*', '/', '+', '-',

	// comparison operators
	'!', '&&', '||', '<', '<=', '>=', '>', '==', '!=',

	// misc
	'=', '?', ':'
];

const keywords = [
	'return'
];

/**
 * A regex that matches valid variable names.
 */
export const nameRegex = /[a-zA-Z_](?:\w)*/;

export default moo.compile({
	// whitespace
	ws: /[ \t]+/,
	nl: {match: /\n/, lineBreaks: true},

	// an integer or floating-point number
	number: /(?:[0-9]*[.])?[0-9]+/,

	name: {
		match: nameRegex,
		type: moo.keywords({
			keyword: keywords
		})
	},

	syntax: syntax,
});
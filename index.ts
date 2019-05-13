import nearley from 'nearley';
import process from 'process';
import * as grammar from './grammar/grammar';

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
parser.feed(process.argv[2]);
console.log(parser.finish());

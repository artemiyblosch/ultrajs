import { mem } from './defaults/mem.ts';
import { bnfRules } from './defaults/bnfRules.ts';
import { tokenrules } from './defaults/tokens.ts';
import { Lexer } from './lexer/lib/lexer.ts'
import { Parser } from './parser/lib/parser.ts';
import { Eval } from './eval/lib/eval.ts';
import { ASTNode } from './parser/helping-types/ASTNode.ts';
import { readFileSync } from 'node:fs';

const argv = require('minimist')(process.argv.slice(2));

let code : string = "";
if (argv?.f) {
    code = readFileSync(argv.f, {encoding: 'utf-8'});
} else if (argv?.e) code = argv.e;
else code = "\n"

const lines = code.split('\n');

for(let line of lines) {
    let lexer = new Lexer(tokenrules);
    const tokens = lexer.parse(line,0);

    let parser = new Parser(bnfRules);
    const ast = (parser.parse(tokens.returned, mem) as ASTNode[]);

    console.debug(Eval(ast));
}
// npx tsx main.ts ...
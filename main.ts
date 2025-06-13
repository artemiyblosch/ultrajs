import { mem } from './defaults/mem.ts';
import { bnfRules } from './defaults/bnfRules.ts';
import { tokenrules } from './defaults/tokens.ts';
import { Lexer } from './lexer/lib/lexer.ts'
import { Parser } from './parser/lib/parser.ts';
import { Eval } from './eval/lib/eval.ts';
import { ASTNode } from './parser/helping-types/ASTNode.ts';

const argv = require('minimist')(process.argv.slice(2));

let code : string = "";
if (argv?.f) {
    require('node:fs').
    readFile(argv.f, 
             'utf8', 
             (_, data) => {
                code = data || "0\n";
             }
    );
} else if (argv?.e) code = argv.e;
else code = "\n"

if (code.at(-1) != "\n") code = code + "\n"

let lexer = new Lexer(tokenrules);
const tokens = lexer.parse(code,0);

let parser = new Parser(bnfRules);
const ast = (parser.parse(tokens.returned, mem) as ASTNode[]);

console.debug(Eval(ast));
// npx tsx main.ts ...
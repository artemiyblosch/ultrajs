var lex = require("./lexer/lib/lexer.ts");
var tr = require("./lexer/defaults/tokens.ts");

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

let lexer = new lex.Lexer(tr.tokenRules);
console.debug(lexer.parse(code,0));
// npx tsx main.ts ...
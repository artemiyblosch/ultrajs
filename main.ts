var lex = require("./lexer/lib/lexer.ts");
var tr = require("./lexer/default_tokens/tokens.ts");

const argv = require('minimist')(process.argv.slice(2));

let code : string = "";
if (argv?.f) {
    require('node:fs').
    readFile(argv.f, 
             'utf8', 
             (err, data) => {
                if(err) throw new Error(`No file found on ${argv.f}`);
                code = data;
             }
    );
} else if (argv?.e) code = argv.e;
else throw new Error("No code to execute");

let lexer = new lex.Lexer(tr.tokenRules);
console.debug(lexer.parse(code));
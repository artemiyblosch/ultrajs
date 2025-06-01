var tkn = require("../classes/token.ts");

interface TokenedCode {
    returned : Array<tkn.Token>;
    pos : number
}

class Lexer {
    tokenRules : tkn.TokenRule[];

    constructor(tokenRules : tkn.TokenRule[]) {
        this.tokenRules = tokenRules;
    }

    parse(code : string, posit : number) : TokenedCode {
        let pos : number = posit || 0;
        let ret : Array<tkn.Token> = [];
        let match : Token | null;

        main: while (pos < code.length) {
            for(let rule of this.tokenRules) {
                match = rule.matchAt(pos,code);
                if (!match) continue;

                ret.push(match);
                pos += match?.data[0].length || 1;

                if(match?.type === "end") break main;
                
                break;
            }
        }

        return {returned: ret, pos};
    }
}
exports.Lexer = Lexer;
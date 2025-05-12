var tkn = require("../classes/token.ts");

class Lexer {
    tokenRules : tkn.TokenRule[];

    constructor(tokenRules : tkn.TokenRule[]) {
        this.tokenRules = tokenRules;
    }

    parse(code : string) : Array<tkn.Token> {
        let pos : number = 0;
        let ret : Array<tkn.Token> = [];
        let match : Token | null;

        while (pos < code.length) {
            for(let rule of this.tokenRules) {
                match = rule.matchAt(pos,code);
                if (!match) continue;

                ret.push(match);
                pos += match?.data[0].length || 1;
                break;
            }
        }

        return ret;
    }
}
exports.Lexer = Lexer;
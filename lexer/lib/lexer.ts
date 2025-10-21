import { Token, TokenRule } from '../classes/token.ts'

interface TokenedCode {
    returned : Array<Token>;
    pos : number
}

export class Lexer {
    tokenRules : TokenRule[];

    constructor(tokenRules : TokenRule[]) {
        this.tokenRules = tokenRules;
    }

    parse(code : string, posit : number) : TokenedCode {
        let pos : number = posit || 0;
        const ret : Array<Token> = [];
        let match : Token | null;

        main: while (pos < code.length) {
            for(const rule of this.tokenRules) {
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
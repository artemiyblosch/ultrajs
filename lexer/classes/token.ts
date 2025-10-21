class Token {
    type : string;
    data : RegExpExecArray;

    constructor(type : string, data : RegExpExecArray) {
        this.type = type;
        this.data = data;
    }
}

class TokenRule {
    rule : RegExp;
    tokenType : string;

    constructor(rule : RegExp, tokenType : string) {
        this.rule = rule;
        this.tokenType = tokenType;
    }

    matchAt(pos : number, code : string) : Token | null {
        this.rule.lastIndex = pos;
        const match : RegExpExecArray | null = this.rule.exec(code);
        this.rule.lastIndex = 0;

        if (!match) return null;
        return new Token(this.tokenType, match);
    }
}
export { Token, TokenRule };
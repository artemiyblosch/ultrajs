import { TokenRule } from "../lexer/classes/token"

let brExp =/ /y;

brExp.exec = function(str : string) : RegExpExecArray | null {
    const start = this.lastIndex;
    if(str[start] != '(') return null;
    let nest : number = 1;
    let end : number = start + 1;
    while(nest != 0 && end < str.length) {
        if(str[end] === '(') nest++;
        else if(str[end] === ')') nest--;
        end++;
    }
    let ret = [str.slice(start,end)];
    (ret as any).index = start;
    (ret as any).input = str;
    return (ret as RegExpExecArray);
}

export let tokenrules = [
    new TokenRule(/\-?\d*\.?\d+/y, "num"),
    new TokenRule(/;+/y, "nline"),
    new TokenRule(brExp, "brGroup"),
    new TokenRule(/\{.*\}/y, "block"),
    new TokenRule(/\n+/y, "end"),
    new TokenRule(/\s+/y, "space"),
    new TokenRule(/\w[\w\d]*/y, "lit"),
    new TokenRule(/:/y, "bindC"),
    new TokenRule(/[^\w\d()\s]+/y, "op"),
]
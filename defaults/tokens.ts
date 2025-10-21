import { TokenRule } from "../lexer/classes/token"

function brExec(opening : string, closing : string) : (str : string) => RegExpExecArray | null {
    return function (str) {
        // @ts-expect-error idklol
        const start = this.lastIndex;
        if(str[start] != opening) return null;
        let nest : number = 1;
        let end : number = start + 1;
        while(nest != 0 && end < str.length) {
            if(str[end] === opening) nest++;
            else if(str[end] === closing) nest--;
            end++;
        }
        const ret = [str.slice(start,end)];
        (ret as any).index = start;
        (ret as any).input = str;
        return (ret as RegExpExecArray);
    }
}

const brExp = / /y;
brExp.exec = brExec('(',')')

const blockExp = / /y;
blockExp.exec = brExec('{','}');

export const tokenrules = [
    new TokenRule(/;+/y, "nline"),
    new TokenRule(brExp, "brGroup"),
    new TokenRule(blockExp, "block"),
    new TokenRule(/(-?\d+)(\.\d+)?(r\d+)?/y, "num"),
    new TokenRule(/\n+/y, "end"),
    new TokenRule(/\s+/y, "space"),
    new TokenRule(/\w[\w\d]*/y, "lit"),
    new TokenRule(/:!/y, "swD"),
    new TokenRule(/:/y, "bindC"),
    new TokenRule(/\?\*/y, "swC"),
    new TokenRule(/[^\w\d()\s]+/y, "op"),
]
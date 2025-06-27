import { createHash } from "crypto";
import { ASTNode } from "../parser/helping-types/ASTNode";
import { Mem } from "../parser/helping-types/BNFRegex"
import { bnfRules } from "./bnfRules";
import { Lexer } from "../lexer/lib/lexer";
import { tokenrules } from "./tokens";
import { Parser } from "../parser/lib/parser";
import { Eval } from "../eval/lib/eval";
import { Value } from "../eval/types/value";
import { Bool } from "../eval/types/bool";
import { defaultSymbol } from "../eval/types/arrayHacks";
var mem : Mem = new Map();

mem.set('pi', Math.PI)
mem.set('e', Math.E)
mem.set('sqrt', Math.sqrt)
mem.set('_RULES_',bnfRules)
mem.set('maybe', new Bool(2))
mem.set('_PREFS_', {
    op: {
        '+': [1,false],
        '-': [1,false],
        '*': [2,false],
        '/': [2,false],
        '=': [0,true],
        '**': [3,true],
        '?': [0,true],
    }
})
mem.set('_FUNCS_', {
    op: {
        '+': (children : any[]) => getAll(children).reduce((a,b)=>a+b),
        '-': (children : any[]) => getAll(children).reduce((a,b)=>a-b),
        '*': (children : any[]) => getAll(children).reduce((a,b)=>a*b),
        '/': (children : any[]) => getAll(children).reduce((a,b)=>a/b),
        '=': (children : any[]) => {
            mem.set(children[0].keySym, children[1]);
            return children[1];
        },
        '**': (children : any[]) => getAll(children).reduce((a,b)=>a**b),
        '?' : (children : any[]) => {
            children = getAll(children);
            let branch = children[0]?.branch ?? +!!children[0];

            children.shift();
           if (!(defaultSymbol in children)) children[defaultSymbol] ??= children.pop();

            if (!(branch - 1 in children)) return children[defaultSymbol];
            return children[branch - 1]
        }
    }
})
mem.set('_EVALRS_', {
    lit: (children : any[], data : string) => parseLit(data),
    num: (children : any[], data : string) => parseFloat(data),
    op: (children : any[], data : string) => mem.get('_FUNCS_').op[data](children),
    brGroup: (children : any[], data : string) => {
        return Eval( new Parser(bnfRules)
        .parse(
            new Lexer(tokenrules)
            .parse(data,0)
            .returned,
            mem
        ) as ASTNode[])[0]
    },
    call: (children : any[], data : string) => {
        const func = parseLit(data);
        return func(...children);
    },
    swC: (children : any[], data : any) => {
        if(!data.has(children[0])) return data.get(defaultSymbol)
        return data.get(children[0])[0]
    },
})

mem.set('_TOKENRULES_', tokenrules)
mem.set('_BNFRULES_', bnfRules)

function parseLit(data : string) : any {
    return new Value(findClosestEntry(data)[1], data);
}

function findClosestEntry(key : string) : [string,any] {
    const entries =  Array.from(mem.entries());
    let minEntry : [string,any] = ['',null]
    let minD = Infinity;
    let curD : number;
    for(let i of entries) {
        curD = levenshteinD(i[0],key);
        if(curD >= minD) continue;
        minEntry = i;
        minD = curD;
    }
    return minEntry;
}

function get(value : any) {
    if(value instanceof Value) return value.value;
    return value;
}

function getAll(arr : any[]) {
    return arr.map((a) => get(a));
}

const levenshteinD = (s, t) => {
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  const arr : number[][] = [];
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
            );
    }
  }
  return arr[t.length][s.length];
};

export {mem}
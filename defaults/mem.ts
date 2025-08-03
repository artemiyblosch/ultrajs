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
mem.set('print', console.log)
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
    num: (children : any[], data : string) => {
        let rec = 0;
        if(data[3]) {
            rec = parseFloat('0.'+data[3].slice(1,data[3].length))
                  /(1-10**(-data[3].length+1))
                  /10**((data[2]?.length ?? 1)-1)
        }
        return parseFloat(data[1]+data[2])+rec;
    },
    while: (children : any[], data : any) => {
        let res : any = null;
        while(Eval(data)) {
            res = Eval(children);
        }
        return res;
    },
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
    block: (children : any[], data : string) => {
        let context : Mem = new Map();
        context.set('_PREF_C_', mem)
        return Eval( new Parser(bnfRules)
        .parse(
            new Lexer(tokenrules)
            .parse(data,0)
            .returned,
            context
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
    return new Value(mem.get(findClosestKey(data)), data);
}

function unwrap(mem : Mem) : Mem {
    if (!mem.has('_PREF_C_')) return mem;
    let pref_c = unwrap(mem.get('_PREF_C_'));
    mem.delete('_PREF_C_')

    for(let i in pref_c.entries()) {
        if(mem.has(i)) continue;
        mem.set(i,pref_c.get(i));
    }
    return mem;
}

function findClosestKey(key : string) : string {
    const entries = Array.from(unwrap(mem).keys()).sort();
    let l = -1;
    let r = entries.length;
    while(r-l > 1) {
        let mid = Math.round((l + r) / 2);

        if(entries[mid] == key) return key;
        if(entries[mid] < key) l = mid;
        else r = mid;
    }
    return entries[l];
}

function get(value : any) {
    if(value instanceof Value) return value.value;
    return value;
}

function getAll(arr : any[]) {
    return arr.map((a) => get(a));
}

export {mem}
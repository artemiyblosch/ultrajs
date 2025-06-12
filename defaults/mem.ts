import { createHash } from "crypto";
import { ASTNode } from "../parser/helping-types/ASTNode";
import { Mem } from "../parser/helping-types/BNFRegex"
import { bnfRules } from "./bnfRules";
var mem : Mem = new Map();

mem.set('pi', Math.PI)
mem.set('sqrt', Math.sqrt)
mem.set('_RULES_',bnfRules)
mem.set('_PREFS_', {
    op: {
        '+' : 1,
        '-' : 1,
        '*' : 2,
        '/' : 2,
        '=' : 0,
    }
})
mem.set('_FUNCS_', {
    op: {
        '+': (children : any[]) => children.reduce((a,b)=>a+b),
        '-': (children : any[]) => children.reduce((a,b)=>a-b),
        '*': (children : any[]) => children.reduce((a,b)=>a*b),
        '/': (children : any[]) => children.reduce((a,b)=>a/b),
        '=': (children : any[]) => mem.set(children[0].data,children[1])
    }
})
mem.set('_EVALRS_', {
    atom: (children : any[], data : any) => data,
    op: (children : any[], data : any) => mem.get('_FUNCS_').op[data](children)
})
export {mem}
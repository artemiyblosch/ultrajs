import { Token } from "../lexer/classes/token";
import { Mem } from "../parser/helping-types/BNFRegex"
import { bnfRules } from "./bnfRules";
var mem : Mem = new Map();

mem.set('pi', Math.PI)
mem.set('sqrt', Math.sqrt)
mem.set('_RULES_',bnfRules)
mem.set('_PREFS_', {
    op: (op) : number => {
        if(op === '+' || op === '-') {
            return 0;
        } else {
            return 1;
        }
    }
})

export {mem}
import { ASTNode } from "../parser/helping-types/ASTNode";
import { BNFRule } from "../parser/helping-types/BNFRule";
import { numberRegex, opRegex } from "./BNFRegex";
import { mem } from "./mem";

const rules : BNFRule[] = [
    new BNFRule(
        numberRegex,
        (match) => {return {expr: [new ASTNode([parseInt(match[0].type)],"num")], pref: 0}}
    ),
    new BNFRule(
        opRegex,
        (match) => {
            let nodeArg = [match[0].type, match[2].type];
            (nodeArg as any).op = match[1];
            return {
                expr: [new ASTNode(nodeArg,'op')],
                pref: mem.get((match[1] as any).data),
            };
        }
    )
]

export {rules};
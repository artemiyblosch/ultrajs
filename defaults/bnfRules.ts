export const bnfRules : BNFRule[] = [
    new BNFRule(
        numberRegex,
        (match) => ({expr: [new ASTNode([],"num",parseInt(match[0].data))], pref: 0})
    ),
    new BNFRule(
        opRegex,
        (match) => ({
            expr: [new ASTNode([match[0], match[2]],'op',match[1])],
            pref: mem.get((match[1] as any).data),
        })
    ),
    new BNFRule(
        endRegex,
        (match) => ({expr: [], pref: 0})
    )
]

import { ASTNode } from "../parser/helping-types/ASTNode";
import { BNFRule } from "../parser/helping-types/BNFRule";
import { endRegex, numberRegex, opRegex } from "./BNFRegex";
import { mem } from "./mem";
export const bnfRules : BNFRule[] = [
    new BNFRule(
        literalRegex,
        (match) => ({
            expr: [new ASTNode([],"lit",match[0].data[0])],
            pref: [0,false],
        })
    ),
    new BNFRule(
        numberRegex,
        (match) => ({
            expr: [new ASTNode([],"num",match[0].data[0])],
            pref: [0,false],
        })
    ),
    new BNFRule(
        callRegex,
        (match) => ({
            expr: [new ASTNode([match[1]],"call", match[0].data)],
            pref: [0,false],
        })
    ),
    new BNFRule(
        brGroupRegex,
        (match) => ({
            expr: [new ASTNode([], 'brGroup', match[0].data[0].slice(1,-1))],
            pref: [0,false]}
        )
    ),
    new BNFRule(
        opRegex,
        (match) => {
            if(match.length == 3) return {
                expr: [new ASTNode([match[0], match[2]],'op',match[1].data[0])],
                pref: mem.get('_PREFS_').op[match[1].data[0]],
            }
            let pref = mem.get('_PREFS_').op[match[2].data[0]];
            pref = [pref[0] + 2, pref[1]];
            return {
                expr: [new ASTNode([match[0], match[4]],'op',match[2].data[0])],
                pref,
            }
        }
    ),
    new BNFRule(
        endRegex,
        (match) => ({expr: [], pref: [0,false]})
    ),
    new BNFRule(
        newLineRegex,
        (match) => ({
            expr: [match[0],match[2]],
            pref: [0,false]
        })
    )
]

import { ASTNode } from "../parser/helping-types/ASTNode";
import { BNFRule } from "../parser/helping-types/BNFRule";
import { brGroupRegex, callRegex, endRegex, literalRegex,
         newLineRegex, numberRegex, opRegex } from "./BNFRegex";
import { mem } from "./mem";
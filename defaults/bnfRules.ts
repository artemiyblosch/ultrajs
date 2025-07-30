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
            pref: [0,false]
        })
    ),
    new BNFRule(
        blockRegex,
        (match) => ({
            expr: [new ASTNode([], 'block', match[0].data[0].slice(1,-1))],
            pref: [0,false]
        })
    ),
    new BNFRule(
        switchCaseOpRegex,
        (match) => {
            let options = new Map();
            options.set(Eval([match[2] as ASTNode])[0], Eval([match[3] as ASTNode]));
            return {
                expr: [new ASTNode([match[0]], 'swC', options)],
                pref: [0,false]
            }
        }
    ),
    new BNFRule(
        switchCaseAddRegex,
        (match) => {
            let options = match[0].data;
            options.set(Eval([match[2] as ASTNode])[0], Eval([match[3] as ASTNode]));
            return {
                expr: [new ASTNode((match[0] as ASTNode).children, 'swC', options)],
                pref: [0,false]
            }
        }
    ),
    new BNFRule(
        switchCaseDefaultRegex,
        (match) => {
            let options = match[0].data;
            options.set(defaultSymbol, Eval([match[2] as ASTNode])[0]);
            return {
                expr: [new ASTNode((match[0] as ASTNode).children, 'swC', options)],
                pref: [0,false]
            }
        }
    ),
    new BNFRule(
        opRegex,
        (match) => {
            if(match.length == 3) return {
                expr: [new ASTNode([match[0], match[2]],'op',match[1].data[0])],
                pref: mem.get('_PREFS_').op[match[1].data[0]],
            }
            let pref = mem.get('_PREFS_').op[match[2].data[0]];
            pref = [pref[0], pref[1]];
            return {
                expr: [new ASTNode([match[0], match[4]],'op',match[2].data[0])],
                pref,
            }
        }
    ),
    new BNFRule(
        bindRegex,
        (match) => {
            if(match[1].data === ":") return {
                expr: [new ASTNode((match[0] as any).children.concat(match[2]), 'op', match[0].data)],
                pref: [0,false]
            }

            let tmp = (match[0] as any).children;
            tmp.default = match[2];
            return {
                expr: [new ASTNode(tmp, 'op', match[0].data)],
                pref: [0,false]
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

import { Eval } from "../eval/lib/eval";
import { defaultSymbol } from "../eval/types/arrayHacks";
import { ASTNode } from "../parser/helping-types/ASTNode";
import { BNFRule } from "../parser/helping-types/BNFRule";
import { bindRegex, blockRegex, brGroupRegex, callRegex, endRegex, literalRegex,
         newLineRegex, numberRegex, opRegex, switchCaseAddRegex, switchCaseDefaultRegex, switchCaseOpRegex, } from "./BNFRegex";
import { mem } from "./mem";
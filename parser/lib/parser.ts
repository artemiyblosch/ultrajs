import { ExprContents, Mem } from "../helping-types/BNFRegex";
import { BNFRule, Match } from "../helping-types/BNFRule";

export class Parser {
    BNFRules : BNFRule[];
    constructor(BNFRules : BNFRule[]) {
        this.BNFRules = BNFRules;
    }

    parse(expr : ExprContents[], mem : Mem) : ExprContents[] {
        let rexpr = expr;
        let matches : Match[] = [];
        let done : boolean = false;

        do {
            done = true;
            for(let rule of this.BNFRules) {
                matches = rule.getAllMatches(expr, mem);
                if(matches.length < 1) continue;
                done = false;

                matches
                .sort((a,b) => b.pref[0] - a.pref[0])
                .filter((a) => a.pref == matches[0].pref);

                matches = matches[0].pref[1] ? matches.reverse() : matches;

                rexpr.splice(matches[0].pos,matches[0].matched_from.length, ...matches[0].matched_to);
                break;
            }
        } while (!done);
        return rexpr;
    }
}
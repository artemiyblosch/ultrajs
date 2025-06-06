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

                if(matches.length < 1) {
                    console.debug("skipped");
                    continue;
                };

                done = false;
                matches.sort((a,b) => a.pref - b.pref);
                rexpr.splice(matches[0].pos,matches[0].matched_from.length, ...matches[0].matched_to);
            }
        } while (!done);
        return rexpr;
    }
}
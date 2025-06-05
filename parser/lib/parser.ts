import { ExprContents, Mem } from "../helping-types/BNFRegex";
import { BNFRule, Match } from "../helping-types/BNFRule";

class Parser {
    BNFRules : BNFRule[];
    constructor(BNFRules : BNFRule[]) {
        this.BNFRules = BNFRules;
    }

    parse(expr : ExprContents[], mem : Mem) : ExprContents[] {
        let rexpr = expr;
        let matches : Match[] = [];
        let rule : BNFRule;
        let done : boolean = true;

        do {
            done = true;
            for(let i in mem) {
                rule = mem.get(i);
                matches = rule.getAllMatches(expr, mem);

                if(matches.length < 1) continue;

                done = false;
                matches.sort((a,b) => a.pref - b.pref);
                rexpr.splice(matches[0].pos,matches[0].matched_from.length, ...matches[0].matched_to);
            }
        } while (!done);
        return rexpr;
    }
}
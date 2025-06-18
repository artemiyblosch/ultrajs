import { BNFRegex, ExprContents, Mem } from "./BNFRegex";

export interface Match {
    matched_from : ExprContents[];
    matched_to : ExprContents[];
    pos : number;
    pref : [number, boolean];
}

export interface PrefExprC {
    pref : [number, boolean];
    expr : ExprContents[];
}

export class BNFRule {
    rule : BNFRegex<ExprContents>;
    transformF : (match : ExprContents[]) => PrefExprC;

    constructor(
        rule : BNFRegex<ExprContents>,
        transformF : (match : ExprContents[]) => PrefExprC
    ) {
        this.rule = rule;
        this.transformF = transformF;
    }

    getAllMatches(expr : ExprContents[], mem : Mem) : Match[] {
        let match : null | ExprContents[] = null;
        let matches : Match[] = [];
        let c : PrefExprC;

        for(let i : number = 0; i < expr.length; i++) {
            match = this.rule.match(expr,i,mem);
            if(match === null) continue;
            c = this.transformF(match);
            matches.push({
                matched_from: match,
                matched_to: c.expr,
                pos: i,
                pref: c.pref, 
            });
        }
        return matches;
    }
}
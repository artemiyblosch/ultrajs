import { BNFRegex, ExprContents, Mem } from "./BNFRegex";

export class BNFRule {
    rule : BNFRegex<ExprContents>;
    transformF : (match : ExprContents[]) => ExprContents[];

    constructor(
        rule : BNFRegex<ExprContents>,
        transformF : (match : ExprContents[]) => ExprContents[]
    ) {
        this.rule = rule;
        this.transformF = transformF;
    }

    getAllMatches(expr : ExprContents[], mem : Mem) : ExprContents[][] {
        let match : null | ExprContents[] = null;
        let matches : ExprContents[][] = [];

        for(let i : number = 0; i < expr.length; i++) {
            match = this.rule.match(expr,i,mem);
            if(match === null) continue;

            matches.push(this.transformF(match));
        }
        return matches;
    }
}
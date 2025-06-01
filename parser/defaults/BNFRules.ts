import { BNFRule, BNFRegex, ExprContents } from "../helping-types/BNFRegex";

function match_c(regex : BNFRegex<ExprContents>) : BNFRule {
    return (arr,pos,mem) => regex.match(arr,pos,mem);
}

let rules : BNFRule[] = [
]
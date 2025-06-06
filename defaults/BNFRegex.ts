import { Token } from "../lexer/classes/token";
import { BNFRegex, ExprContents, Predicate } from "../parser/helping-types/BNFRegex";

type ExprBNF = BNFRegex<ExprContents>;
type ExprPred = Predicate<ExprContents>;

function tokenTypePred(type : string) : ExprPred {
    return new Predicate((p) => (p instanceof Token) && (p.type === type));
}
const anyPred : ExprPred = new Predicate((arg)=>true)
function neg(pred : ExprPred) : ExprPred {
    return new Predicate((p) => !pred.pred(p));
}
function and(pred1 : ExprPred, pred2 : ExprPred) : ExprPred {
    return new Predicate((p) => pred1.pred(p) && pred2.pred(p));
}

export const numberRegex : ExprBNF = new BNFRegex( [tokenTypePred("num")] )
export const opRegex : ExprBNF =
new BNFRegex( 
    [[ 
      anyPred,
      tokenTypePred("opr"),
      anyPred
    ]]
)
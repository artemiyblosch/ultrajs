import { Token } from "../lexer/classes/token";
import { ASTNode } from "../parser/helping-types/ASTNode";
import { BNFRegex, ExprContents, Predicate } from "../parser/helping-types/BNFRegex";

type ExprBNF = BNFRegex<ExprContents>;
type ExprPred = Predicate<ExprContents>;

function tokenTypePred(type : string) : ExprPred {
    return new Predicate((p) => (p instanceof Token) && (p.type === type));
}
function ASTTypePred(type : string) : ExprPred {
    return new Predicate((p) => (p instanceof ASTNode) && (p.type === type));
}
const anyPred : ExprPred = new Predicate((p)=>true)
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
      neg(tokenTypePred('space')),
      tokenTypePred("op"),
      neg(tokenTypePred('space'))
    ],
    [
        anyPred,
        tokenTypePred('space'),
        tokenTypePred("op"),
        tokenTypePred('space'),
        anyPred
    ]]
)

export const endRegex : ExprBNF = new BNFRegex([tokenTypePred('end'),tokenTypePred('nline')])

export const newLineRegex : ExprBNF = new BNFRegex([[
    new Predicate((p)=>p instanceof ASTNode),
    tokenTypePred('nline'),
    new Predicate((p)=>p instanceof ASTNode),
]])

export const literalRegex : ExprBNF = new BNFRegex([tokenTypePred('lit')])

export const brGroupRegex : ExprBNF = new BNFRegex([tokenTypePred('brGroup')])

export const callRegex : ExprBNF = 
new BNFRegex([[
    ASTTypePred('lit'),
    ASTTypePred('brGroup'),
]])
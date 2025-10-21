import { Token } from "../lexer/classes/token";
import { ASTNode } from "../parser/helping-types/ASTNode";
import { BNFRegex, ExprContents, Predicate } from "../parser/helping-types/BNFRegex";

type ExprBNF = BNFRegex<ExprContents>;
type ExprPred = Predicate<ExprContents>;

function tokenTypePred(type : string) : ExprPred {
    return new Predicate((p) => (p instanceof Token) && (p.type === type));
}

function litNamePred(name : string) : ExprPred {
    return new Predicate((p) => (p instanceof Token) && (p.type === 'lit') && (p.data[0] === name))
}

function ASTTypePred(type : string) : ExprPred {
    return new Predicate((p) => (p instanceof ASTNode) && (p.type === type));
}

function neg(pred : ExprPred) : ExprPred {
    return new Predicate((p) => !pred.pred(p));
}

/*function and(pred1 : ExprPred, pred2 : ExprPred) : ExprPred {
    return new Predicate((p) => pred1.pred(p) && pred2.pred(p));
}*/
const nonSpaceRegex = neg(tokenTypePred('space'));

export const numberRegex : ExprBNF = new BNFRegex( [tokenTypePred("num")] )

export const opRegex : ExprBNF =
new BNFRegex( 
    [[ 
      nonSpaceRegex,
      tokenTypePred("op"),
      nonSpaceRegex,
    ],
    [
        nonSpaceRegex,
        tokenTypePred('space'),
        tokenTypePred("op"),
        tokenTypePred('space'),
        nonSpaceRegex,
    ]]
)

export const endRegex : ExprBNF = new BNFRegex([tokenTypePred('end'),tokenTypePred('nline'),tokenTypePred('space')])

export const newLineRegex : ExprBNF = new BNFRegex([[
    new Predicate((p)=>p instanceof ASTNode),
    tokenTypePred('nline'),
    new Predicate((p)=>p instanceof ASTNode),
]])

export const literalRegex : ExprBNF = new BNFRegex([tokenTypePred('lit')])

export const brGroupRegex : ExprBNF = new BNFRegex([tokenTypePred('brGroup')])
export const blockRegex : ExprBNF = new BNFRegex([tokenTypePred('block')])

export const callRegex : ExprBNF = 
new BNFRegex([[
    ASTTypePred('lit'),
    ASTTypePred('brGroup'),
]])

export const bindRegex : ExprBNF = 
new BNFRegex([[
    ASTTypePred('op'),
    tokenTypePred('bindC'),
    nonSpaceRegex,
]])

export const switchCaseOpRegex : ExprBNF =
new BNFRegex([[
    nonSpaceRegex,
    tokenTypePred('swC'),
    ASTTypePred('brGroup'),
    nonSpaceRegex
]])

export const switchCaseAddRegex : ExprBNF =
new BNFRegex([[
    ASTTypePred('swC'),
    tokenTypePred('bindC'),
    ASTTypePred('brGroup'),
    nonSpaceRegex
]])

export const switchCaseDefaultRegex : ExprBNF =
new BNFRegex([[
    ASTTypePred('swC'),
    tokenTypePred('swD'),
    nonSpaceRegex
]])

export const whileStmtRegex : ExprBNF =
new BNFRegex([[
    litNamePred('while'),
    ASTTypePred('brGroup'),
    ASTTypePred('block')
]])
import { TokenRule } from "../classes/token"

let tokenrules = [
    new TokenRule(/\d+/y, "num"),
    new TokenRule(/;+/y, "nline"),
    new TokenRule(/\(/y, "brOpen"),
    new TokenRule(/\)/y, "brClose"),
    new TokenRule(/\{.*\}/y, "block"),
    new TokenRule(/\n+/y, "end"),
    new TokenRule(/\s+/y, "space"),
    new TokenRule(/\w[\w\d]*/y, "literal"),
    new TokenRule(/[^\w\d]+/y, "op"),
]

exports.tokenRules = tokenrules
var tkn = require("../classes/token.ts")
let tokenrules = [
    new tkn.TokenRule(/\d+/y, "num"),
    new tkn.TokenRule(/;+/y, "nline"),
    new tkn.TokenRule(/\(/y, "brOpen"),
    new tkn.TokenRule(/\)/y, "brClose"),
    new tkn.TokenRule(/\{.*\}/y, "block"),
    new tkn.TokenRule(/\n+/y, "end"),
    new tkn.TokenRule(/\s+/y, "space"),
    new tkn.TokenRule(/\S+/y, "literal"),
]

exports.tokenRules = tokenrules
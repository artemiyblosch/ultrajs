var tkn = require("../classes/token.ts")
let tokenrules = [
    new tkn.TokenRule(/\d+/y, "num"),
    new tkn.TokenRule(/\w(\w|\d)*/y, "literal"),
    new tkn.TokenRule(/(\n|;)+/y, "nline"),
    new tkn.TokenRule(/\s+/y, "space"),
]

exports.tokenRules = tokenrules
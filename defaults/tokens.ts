import { TokenRule } from "../lexer/classes/token"

export let tokenrules = [
    new TokenRule(/\d+/y, "num"),
    new TokenRule(/;+/y, "nline"),
    new TokenRule(/\(/y, "brOpen"),
    new TokenRule(/\)/y, "brClose"),
    new TokenRule(/\{.*\}/y, "block"),
    new TokenRule(/\n+/y, "end"),
    new TokenRule(/\s+/y, "space"),
    new TokenRule(/\w[\w\d]*/y, "lit"),
    new TokenRule(/[^\w\d]+/y, "op"),
]
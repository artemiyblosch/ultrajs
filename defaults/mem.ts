import { createHash } from "crypto";
import { ASTNode } from "../parser/helping-types/ASTNode";
import { Mem } from "../parser/helping-types/BNFRegex"
import { bnfRules } from "./bnfRules";
import { Lexer } from "../lexer/lib/lexer";
import { tokenrules } from "./tokens";
import { Parser } from "../parser/lib/parser";
import { Eval } from "../eval/lib/eval";
var mem : Mem = new Map();
const KeySymbol = Symbol("key");

mem.set('pi', Math.PI)
mem.set('sqrt', Math.sqrt)
mem.set('_RULES_',bnfRules)
mem.set('_PREFS_', {
    op: {
        '+' : 1,
        '-' : 1,
        '*' : 2,
        '/' : 2,
        '=' : 0,
    }
})
mem.set('_FUNCS_', {
    op: {
        '+': (children : any[]) => children.reduce((a,b)=>a+b),
        '-': (children : any[]) => children.reduce((a,b)=>a-b),
        '*': (children : any[]) => children.reduce((a,b)=>a*b),
        '/': (children : any[]) => children.reduce((a,b)=>a/b),
        '=': (children : any[]) => mem.set(children[0][KeySymbol],children[1])
    }
})
mem.set('_EVALRS_', {
    lit: (children : any[], data : any) => {
        let [,value] = findClosestEntry(data, mem);
        value[KeySymbol] = data;
        return value;
    },
    num: (children : any[], data : any) => +data,
    op: (children : any[], data : any) => mem.get('_FUNCS_').op[data](children),
    brGroup: (children : any[], data : string) => {
        return Eval( new Parser(bnfRules)
        .parse(
            new Lexer(tokenrules)
            .parse(data,0)
            .returned,
            mem
        ) as ASTNode[])
    }
})

function findClosestEntry(key : string, mem : Mem) {
    return Array.from(mem.entries())
          .sort(
            (a : [string, any],b : [string,any]) => levesteinD(b[0],a[0])
           )[0];
}

function levesteinD(s : string, t : string) : number {
if (s === t) {
        return 0;
    }
    var n = s.length, m = t.length;
    if (n === 0 || m === 0) {
        return n + m;
    }
    var x = 0, y, a, b, c, d, g, h, k;
    var p = new Array(n);
    for (y = 0; y < n;) {
        p[y] = ++y;
    }

    for (; (x + 3) < m; x += 4) {
        var e1 = t.charCodeAt(x);
        var e2 = t.charCodeAt(x + 1);
        var e3 = t.charCodeAt(x + 2);
        var e4 = t.charCodeAt(x + 3);
        c = x;
        b = x + 1;
        d = x + 2;
        g = x + 3;
        h = x + 4;
        for (y = 0; y < n; y++) {
            k = s.charCodeAt(y);
            a = p[y];
            if (a < c || b < c) {
                c = (a > b ? b + 1 : a + 1);
            }
            else {
                if (e1 !== k) {
                    c++;
                }
            }

            if (c < b || d < b) {
                b = (c > d ? d + 1 : c + 1);
            }
            else {
                if (e2 !== k) {
                    b++;
                }
            }

            if (b < d || g < d) {
                d = (b > g ? g + 1 : b + 1);
            }
            else {
                if (e3 !== k) {
                    d++;
                }
            }

            if (d < g || h < g) {
                g = (d > h ? h + 1 : d + 1);
            }
            else {
                if (e4 !== k) {
                    g++;
                }
            }
            p[y] = h = g;
            g = d;
            d = b;
            b = c;
            c = a;
        }
    }

    for (; x < m;) {
        var e = t.charCodeAt(x);
        c = x;
        d = ++x;
        for (y = 0; y < n; y++) {
            a = p[y];
            if (a < c || d < c) {
                d = (a > d ? d + 1 : a + 1);
            }
            else {
                if (e !== s.charCodeAt(y)) {
                    d = c + 1;
                }
                else {
                    d = c;
                }
            }
            p[y] = d;
            c = a;
        }
        h = d;
    }

    return h;
}

export {mem}
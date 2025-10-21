import { mem } from "../../defaults/mem";
import { Token } from "../../lexer/classes/token";
import { ExprContents } from "../../parser/helping-types/BNFRegex";

export function Eval(ast : ExprContents[]) : any[] {
    const values : any[] = [];
    for(const node of ast) {
        if(node instanceof Token) continue;

        node.children = node.children.map((value) => Eval([value])).flat();
        values.push(mem.get('_EVALRS_')[node.type](node.children,node.data));
    }

    return values;
}
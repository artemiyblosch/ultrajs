import { mem } from "../../defaults/mem";
import { ASTNode } from "../../parser/helping-types/ASTNode";

export function Eval(ast : ASTNode[]) : any[] {
    let values : any[] = [];
    for(let node of ast) {
        (node as any).children = node.children.map((value) => Eval([value])).flat();
        values.push(mem.get('_EVALRS_')[node.type](node.children,node.data));
    }

    return values;
}
import { ExprContents } from "./BNFRegex";

export class ASTNode {
    children : ExprContents[];
    type : string;
    data : any;
    constructor(children: ExprContents[], type: string, data: Map<any, any>) {
        this.children = children;
        this.type = type;
        this.data = data;
    }
}
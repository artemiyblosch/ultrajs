export class ASTNode {
    children : Array<ASTNode>
    type : string;
    constructor(children, type) {
        this.children = children;
        this.type = type;
    }
}
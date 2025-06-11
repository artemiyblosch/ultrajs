export class ASTNode {
    children : Array<ASTNode>;
    type : string;
    data : any;
    constructor(children, type, data) {
        this.children = children;
        this.type = type;
        this.data = data;
    }
}
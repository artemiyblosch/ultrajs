import { Token } from '../../lexer/classes/token'
import { ASTNode } from './ASTNode';

export type ExprContents = Token | ASTNode;
export type Mem = Map<string, any>;
interface BNFPiece<T> {
    match : (arr : Array<T>, pos : number, mem : Mem) => null | Array<T>;
}


export class BNFRegex<T> {
    alternatives : (BNFPiece<T> | BNFPiece<T>[])[];
    constructor(alternatives : (BNFPiece<T> | BNFPiece<T>[])[]) {
        this.alternatives = alternatives;
    }

    match(arr : T[], pos : number, mem : Mem) : null | Array<T> {
        let match : null | T[] = null;
        for(let i of this.alternatives) {
            if(i instanceof Array) {
                match = BNFRegex.matchSeq(i, arr, pos, mem);
            } else {
                match = i.match(arr,pos,mem);
            }
            
            if(match !== null) return match;
        }
        return null;
    }

    public static matchSeq<T>(seq : BNFPiece<T>[], arr : T[], pos : number, mem : Mem) : null | T[] {
        let match : T[] = [];
        let matchlet : null | T[] = null;

        for(let i of seq) {
            matchlet = i.match(arr,pos,mem);
            switch (matchlet) {
                case null: return null;
                default: 
                pos += matchlet.length;
                match = match.concat(matchlet);
            }
        }
        return match;
    }
}

export class Predicate<T> {
    pred : (p : T) => boolean;
    constructor(pred : (p : T) => boolean) {
        this.pred = pred;
    }

    match(arr : Array<T>, pos : number, mem : Mem) : null | Array<T> {
        if(this.pred(arr[pos])) return [arr[pos]];
        return null;
    }
}

export class Link<T> {
    to : string;
    constructor(to : string) {
        this.to = to;
    }

    resolve(mem : Mem) : BNFRegex<T> {
        const r : any = mem.get(this.to);
        if(r instanceof BNFRegex) {
            return r;
        } else {
            return new BNFRegex<T>([
                new Predicate<T>(
                    (p) => p === this.to
                )
            ]);
        }
    }

    match(arr : T[], pos : number, mem : Mem) : null | T[] {
        return this.resolve(mem).match(arr,pos,mem);
    }
}
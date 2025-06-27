const permitSymbol = Symbol("permit");
export function addProp(arr : ArrayLike<any>, key : any, value : any) {
    (arr as any)[key] = value;

    if(!(permitSymbol in arr)) arr[permitSymbol] = [];
    arr[permitSymbol].append(key);

    arr[Symbol.iterator] = function*() {
        for(let i = 0; i < arr.length; i++) {
            yield arr[i];
        }

        for(let i of arr[permitSymbol]) {
            yield arr[i];
        }
    }
    arr["map"] = (callbackfn, thisArg : any) => {
        let t : any = Array.prototype.map.call(arr,callbackfn,thisArg);
        for(let i of arr[permitSymbol]) {
            t[i] = arr[i]
        }
        return t;
    }
    return arr;
}
//maybe will be needed

export const defaultSymbol = Symbol("defaults");
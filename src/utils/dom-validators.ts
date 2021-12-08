export class DomValidators {
    public static isElement(nodo: Node): nodo is Element {
        return nodo && nodo.nodeType === 1;
    }

    public static isAttr(nodo: Node): nodo is Attr {
        return nodo && nodo.nodeType === 2;
    }

    public static isText(nodo: Node): nodo is Text {
        return nodo && nodo.nodeType === 3;
    }

    public static isDocument(nodo: Node): nodo is Document {
        return nodo && nodo.nodeType === 9;
    }
}

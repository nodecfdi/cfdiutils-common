/**
 * DOM validators for compare node elements.
 * @public
 */
export const DomValidators = {
    isElement(nodo: Node): nodo is Element {
        return nodo && nodo.nodeType === 1;
    },

    isAttr(nodo: Node): nodo is Attr {
        return nodo && nodo.nodeType === 2;
    },

    isText(nodo: Node): nodo is Text {
        return nodo && nodo.nodeType === 3;
    },

    isDocument(nodo: Node): nodo is Document {
        return nodo && nodo.nodeType === 9;
    }
};

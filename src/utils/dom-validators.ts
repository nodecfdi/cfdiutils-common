/**
 * DOM validators for compare node elements.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const DomValidators = {
  isElement(nodo?: Node): nodo is Element {
    return Boolean(nodo && nodo.nodeType === nodo.ELEMENT_NODE);
  },

  isAttr(nodo?: Node): nodo is Attr {
    return Boolean(nodo && nodo.nodeType === nodo.ATTRIBUTE_NODE);
  },

  isText(nodo?: Node): nodo is Text {
    return Boolean(nodo && nodo.nodeType === nodo.TEXT_NODE);
  },

  isDocument(nodo?: Node): nodo is Document {
    return Boolean(nodo && nodo.nodeType === nodo.DOCUMENT_NODE);
  },
};

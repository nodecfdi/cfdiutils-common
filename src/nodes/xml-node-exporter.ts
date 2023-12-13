import { Xml } from '../utils/xml.js';
import { type NodeHasValueInterface } from './node-has-value-interface.js';
import { type NodeInterface } from './node-interface.js';

export class XmlNodeExporter {
  public export(node: NodeInterface): Element {
    const document = Xml.newDocument();
    const rootElement = this.exportRecursive(document, node);
    document.appendChild(rootElement);

    return rootElement;
  }

  private exportRecursive(document: Document, node: NodeInterface): Element {
    const element = document.createElement(node.name());

    for (const [key, value] of node.attributes().entries()) {
      element.setAttribute(key, value);
    }

    for (const child of node.children()) {
      const childElement = this.exportRecursive(document, child);
      element.appendChild(childElement);
    }

    if (this.isNodeHasValueInterface(node) && node.value() !== '') {
      element.appendChild(document.createTextNode(node.value()));
    }

    return element;
  }

  private isNodeHasValueInterface(nodo: NodeInterface | NodeHasValueInterface): nodo is NodeHasValueInterface {
    return (
      typeof (nodo as NodeHasValueInterface).value === 'function' &&
      typeof (nodo as NodeHasValueInterface).setValue === 'function'
    );
  }
}

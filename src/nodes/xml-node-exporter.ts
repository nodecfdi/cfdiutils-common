import { Xml } from '../utils/xml';
import { type CNodeHasValueInterface } from './c-node-has-value-interface';
import { type CNodeInterface } from './c-node-interface';

/**
 * @public
 */
export class XmlNodeExporter {
    public export(node: CNodeInterface): Element {
        const document = Xml.newDocument();
        const rootElement = this.exportRecursive(document, node);
        document.appendChild(rootElement);

        return rootElement;
    }

    private exportRecursive(document: Document, node: CNodeInterface): Element {
        const element = document.createElement(node.name());

        for (const [key, value] of node.attributes().entries()) {
            element.setAttribute(key, value);
        }

        for (const child of node.children()) {
            const childElement = this.exportRecursive(document, child);
            element.appendChild(childElement);
        }

        if (this.isCNodeHasValueInterface(node) && node.value() !== '') {
            element.appendChild(document.createTextNode(node.value()));
        }

        return element;
    }

    private isCNodeHasValueInterface(nodo: CNodeInterface | CNodeHasValueInterface): nodo is CNodeHasValueInterface {
        return (
            typeof (nodo as CNodeHasValueInterface).value === 'function' &&
            typeof (nodo as CNodeHasValueInterface).setValue === 'function'
        );
    }
}

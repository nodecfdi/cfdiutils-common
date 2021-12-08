import { CNodeInterface } from './c-node-interface';
import { CNode } from './c-node';
import { DomValidators } from '../utils/dom-validators';

export class XmlNodeImporter {
    private registeredNamespaces: Record<string, string> = {};

    public import(element: Element): CNodeInterface {
        const node = new CNode(element.tagName);
        if (element.prefix !== '') {
            this.registerNamespace(node, `xmlns:${element.prefix}`, element.namespaceURI || '');
            this.registerNamespace(node, `xmlns:xsi`, 'http://www.w3.org/2001/XMLSchema-instance');
        }

        const xmlAttributes = element.attributes;
        let i;
        for (i = 0; i < xmlAttributes.length; i++) {
            node.attributes().set(xmlAttributes[i].name, xmlAttributes[i].value);
        }

        // element is like <element namespace="uri"/>
        if (element.hasAttributeNS('http://www.w3.org/2000/xmlns/', '')) {
            node.attributes().set('xmlns', element.getAttributeNS('http://www.w3.org/2000/xmlns/', ''));
        }

        const children = element.childNodes;
        let j;
        for (j = 0; j < children.length; j++) {
            const child = children[j];
            if (!DomValidators.isElement(child)) {
                continue;
            }
            const childNode = this.import(child);
            node.children().add(childNode);
        }
        return node;
    }

    private registerNamespace(node: CNode, prefix: string, uri: string) {
        if (this.registeredNamespaces[prefix])
            return;
        this.registeredNamespaces[prefix] = uri;
        node.attributes().set(prefix, uri);
    }
}

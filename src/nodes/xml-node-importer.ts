import { CNodeInterface } from './c-node-interface';
import { CNode } from './c-node';
import { DomValidators } from '../utils/dom-validators';
import { CNodeHasValueInterface } from './c-node-has-value-interface';

export class XmlNodeImporter {
    /**
     * Local record for registered namespaces to avoid set the namespace declaration in every child
     */
    private registeredNamespaces: Record<string, string> = {};

    public import(element: Element): CNodeInterface & CNodeHasValueInterface {
        const node = new CNode(element.tagName);

        node.setValue(this.extractValue(element));

        if (element.prefix && element.prefix !== '') {
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

    private registerNamespace(node: CNode, prefix: string, uri: string): void {
        if (this.registeredNamespaces[prefix]) return;
        this.registeredNamespaces[prefix] = uri;
        node.attributes().set(prefix, uri);
    }

    private extractValue(element: Element): string {
        const values: string[] = [];

        for (const children of Array.from(element.childNodes)) {
            if (!DomValidators.isText(children)) {
                continue;
            }

            values.push(children.data);
        }

        return values.join('');
    }
}

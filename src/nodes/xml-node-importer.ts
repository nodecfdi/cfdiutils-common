import { DomValidators } from '../utils/dom-validators';
import { CNode } from './c-node';
import { type CNodeHasValueInterface } from './c-node-has-value-interface';
import { type CNodeInterface } from './c-node-interface';

export class XmlNodeImporter {
    /**
     * Local record for registered namespaces to avoid set the namespace declaration in every child
     */
    private registeredNamespaces: Record<string, string> = {};

    public import(element: Element): CNodeInterface & CNodeHasValueInterface {
        const node = new CNode(element.tagName);

        node.setValue(this.extractValue(element));

        if (element.prefix && element.prefix !== '') {
            this.registerNamespace(node, `xmlns:${element.prefix}`, element.namespaceURI ?? '');
            this.registerNamespace(node, `xmlns:xsi`, 'http://www.w3.org/2001/XMLSchema-instance');
        }

        const xmlAttributes = element.attributes;
        let index;
        for (index = 0; index < xmlAttributes.length; index++) {
            node.attributes().set(xmlAttributes[index].name, xmlAttributes[index].value);
        }

        // Element is like <element namespace="uri"/>
        if (element.hasAttributeNS('http://www.w3.org/2000/xmlns/', '')) {
            node.attributes().set('xmlns', element.getAttributeNS('http://www.w3.org/2000/xmlns/', '') as string);
        }

        const children = element.childNodes;
        let index_;
        for (index_ = 0; index_ < children.length; index_++) {
            const child = children[index_];
            if (!DomValidators.isElement(child)) {
                continue;
            }

            const childNode = this.import(child);
            node.children().add(childNode);
        }

        return node;
    }

    private registerNamespace(node: CNode, prefix: string, uri: string): void {
        if (this.registeredNamespaces[prefix]) {
            return;
        }

        this.registeredNamespaces[prefix] = uri;
        node.attributes().set(prefix, uri);
    }

    private extractValue(element: Element): string {
        const values: string[] = [];
        for (let children = element.firstChild; children !== null; children = children.nextSibling) {
            if (!DomValidators.isText(children)) {
                continue;
            }

            values.push(children.data);
        }

        return values.join('');
    }
}

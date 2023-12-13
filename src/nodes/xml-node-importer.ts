import { DomValidators } from '../utils/dom-validators.js';
import { Node } from './node.js';
import { type NodeHasValueInterface } from './node-has-value-interface.js';
import { type NodeInterface } from './node-interface.js';

export class XmlNodeImporter {
  /**
   * Local record for registered namespaces to avoid set the namespace declaration in every child
   */
  private registeredNamespaces: Record<string, string> = {};

  public import(element: Element): NodeInterface & NodeHasValueInterface {
    const node = new Node(element.tagName);

    node.setValue(this.extractValue(element));

    if (element.prefix && element.prefix !== '') {
      this.registerNamespace(node, `xmlns:${element.prefix}`, element.namespaceURI!);
      this.registerNamespace(node, `xmlns:xsi`, 'http://www.w3.org/2001/XMLSchema-instance');
    }

    // eslint-disable-next-line unicorn/prefer-spread
    for (const attribute of Array.from(element.attributes)) {
      node.attributes().set(attribute.name, attribute.value);
    }

    // Element is like <element namespace="uri"/>
    /* istanbul ignore if -- @preserve Hard of test */
    if (element.hasAttributeNS('http://www.w3.org/2000/xmlns/', '')) {
      node.attributes().set('xmlns', element.getAttributeNS('http://www.w3.org/2000/xmlns/', ''));
    }

    // eslint-disable-next-line unicorn/prefer-spread
    for (const children of Array.from(element.childNodes)) {
      if (!DomValidators.isElement(children)) {
        continue;
      }

      const childNode = this.import(children);
      node.children().add(childNode);
    }

    return node;
  }

  private registerNamespace(node: Node, prefix: string, uri: string): void {
    if (this.registeredNamespaces[prefix]) {
      return;
    }

    this.registeredNamespaces[prefix] = uri;
    node.attributes().set(prefix, uri);
  }

  private extractValue(element: Element): string {
    const values: string[] = [];
    // eslint-disable-next-line unicorn/prefer-spread
    for (const children of Array.from(element.childNodes)) {
      if (!DomValidators.isText(children)) {
        continue;
      }

      values.push(children.data);
    }

    return values.join('');
  }
}

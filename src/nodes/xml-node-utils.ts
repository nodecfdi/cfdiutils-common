import { getSerializer } from '../dom.js';
import { Xml } from '../utils/xml.js';
import { type NodeHasValueInterface } from './node-has-value-interface.js';
import { type NodeInterface } from './node-interface.js';
import { XmlNodeExporter } from './xml-node-exporter.js';
import { XmlNodeImporter } from './xml-node-importer.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const XmlNodeUtils = {
  nodeToXmlElement(node: NodeInterface): Element {
    return new XmlNodeExporter().export(node);
  },

  nodeToXmlString(node: NodeInterface, withXmlHeader = false): string {
    const element = XmlNodeUtils.nodeToXmlElement(node);
    if (withXmlHeader) {
      const document = element.ownerDocument;
      const pi = document.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');
      document.insertBefore(pi, document.firstChild);

      return getSerializer().serializeToString(document);
    }

    return getSerializer().serializeToString(element.ownerDocument);
  },

  nodeFromXmlElement(element: Element): NodeInterface & NodeHasValueInterface {
    return new XmlNodeImporter().import(element);
  },

  nodeFromXmlString(content: string): NodeInterface & NodeHasValueInterface {
    return XmlNodeUtils.nodeFromXmlElement(Xml.documentElement(Xml.newDocumentContent(content)));
  },
};

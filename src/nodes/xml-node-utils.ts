import { getSerializer } from '../dom';
import { Xml } from '../utils/xml';
import { type CNodeHasValueInterface } from './c-node-has-value-interface';
import { type CNodeInterface } from './c-node-interface';
import { XmlNodeExporter } from './xml-node-exporter';
import { XmlNodeImporter } from './xml-node-importer';

/**
 * @public
 */
export const XmlNodeUtils = {
    nodeToXmlElement(node: CNodeInterface): Element {
        return new XmlNodeExporter().export(node);
    },

    nodeToXmlString(node: CNodeInterface, withXmlHeader = false): string {
        const element = XmlNodeUtils.nodeToXmlElement(node);
        if (withXmlHeader) {
            const document = element.ownerDocument;
            const pi = document.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');
            document.insertBefore(pi, document.firstChild);

            return getSerializer().serializeToString(document);
        }

        return getSerializer().serializeToString(element.ownerDocument);
    },

    nodeFromXmlElement(element: Element): CNodeInterface & CNodeHasValueInterface {
        return new XmlNodeImporter().import(element);
    },

    nodeFromXmlString(content: string): CNodeInterface & CNodeHasValueInterface {
        return XmlNodeUtils.nodeFromXmlElement(Xml.documentElement(Xml.newDocumentContent(content)));
    }
};

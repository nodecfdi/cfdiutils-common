import { CNodeInterface } from './c-node-interface';
import { XmlNodeExporter } from './xml-node-exporter';
import { XmlNodeImporter } from './xml-node-importer';
import { Xml } from '~/utils/xml';
import { CNodeHasValueInterface } from './c-node-has-value-interface';
import { getSerializer } from '~/dom';

export class XmlNodeUtils {
    public static nodeToXmlElement(node: CNodeInterface): Element {
        return new XmlNodeExporter().export(node);
    }

    public static nodeToXmlString(node: CNodeInterface, withXmlHeader = false): string {
        const element = XmlNodeUtils.nodeToXmlElement(node);
        if (withXmlHeader) {
            const document = element.ownerDocument;
            const pi = document.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');
            document.insertBefore(pi, document.firstChild);

            return getSerializer().serializeToString(document);
        }

        return getSerializer().serializeToString(element.ownerDocument);
    }

    public static nodeFromXmlElement(element: Element): CNodeInterface & CNodeHasValueInterface {
        return new XmlNodeImporter().import(element);
    }

    public static nodeFromXmlString(content: string): CNodeInterface & CNodeHasValueInterface {
        return XmlNodeUtils.nodeFromXmlElement(Xml.documentElement(Xml.newDocumentContent(content)));
    }
}

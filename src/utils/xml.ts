import { DOMParser, DOMImplementation } from '@xmldom/xmldom';
import { DomValidators } from './dom-validators';

export class Xml {
    public static documentElement(document: Document): Element {
        if (!DomValidators.isElement(document.documentElement)) {
            throw new SyntaxError('Document does not have root element');
        }
        return document.documentElement;
    }

    public static ownerDocument(node: Node): Document {
        if (!node.ownerDocument) {
            if (DomValidators.isDocument(node)) {
                return node;
            }
            throw new TypeError('node.ownerDocument is undefined but node is not a Document');
        }
        return node.ownerDocument;
    }

    public static newDocument(document?: Document): Document {
        if (!document) document = new DOMImplementation().createDocument('', '', null);
        return document;
    }

    public static newDocumentContent(content: string): Document {
        if (content === '') {
            throw new SyntaxError('Received xml string argument is empty');
        }
        const errors: Record<string, unknown> = {};
        const parser = new DOMParser({
            errorHandler: (level, msg): void => {
                errors[level] = msg;
            },
        });
        const docParse = parser.parseFromString(content, 'text/xml');
        if (Object.keys(errors).length !== 0) {
            throw new SyntaxError(`Cannot create a Document from xml string, errors: ${JSON.stringify(errors)}`);
        }
        return Xml.newDocument(docParse);
    }

    public static isValidXmlName(name: string): boolean {
        if (name === '') return false;
        return /^[\p{L}_:][\p{L}\d_:.-]*$/u.test(name);
    }

    public static createElement(document: Document, name: string, content = ''): Element {
        return Xml.createDOMElement(
            () => {
                if (!name) {
                    throw new SyntaxError('Empty Name');
                }
                return document.createElement(name);
            },
            `Cannot create element with name ${name}`,
            content
        );
    }

    public static createDOMElement(makeElement: () => Element, errorMessage: string, content: string): Element {
        let element: Element | null = null;
        let previousException: Error | null = null;
        try {
            element = makeElement();
        } catch (e) {
            previousException = e as Error;
        }
        if (!element || !DomValidators.isElement(element)) {
            throw new SyntaxError(
                `${errorMessage} on ${previousException ? previousException.message : 'not is element'}`
            );
        }
        if (content !== '') {
            element?.appendChild(Xml.ownerDocument(element).createTextNode(content));
        }
        return element;
    }
}

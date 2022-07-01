import { DomValidators } from './dom-validators';
import { getDom, getParser } from '~/dom';

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
        if (!document) document = getDom().createDocument('', '', null);

        return document;
    }

    public static newDocumentContent(content: string): Document {
        if (content === '') {
            throw new SyntaxError('Received xml string argument is empty');
        }
        const parser = getParser();
        try {
            const docParse = parser.parseFromString(content, 'text/xml');

            // Capture errors for browser usage
            if (docParse.getElementsByTagName('parsererror').length > 0) {
                throw new Error('Error parsing XML');
            }

            return Xml.newDocument(docParse);
        } catch (error) {
            throw new SyntaxError(`Cannot create a Document from xml string, errors: ${JSON.stringify(error)}`);
        }
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

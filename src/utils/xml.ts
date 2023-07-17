import { getDom, getParser } from '../dom';
import { DomValidators } from './dom-validators';

/**
 * XML static utils
 */
export const Xml = {
    documentElement(document: Document): Element {
        if (!DomValidators.isElement(document.documentElement)) {
            throw new SyntaxError('Document does not have root element');
        }

        return document.documentElement;
    },

    ownerDocument(node: Node): Document {
        if (!node.ownerDocument) {
            /* istanbul ignore else -- @preserve */
            if (DomValidators.isDocument(node)) {
                return node;
            }

            /* istanbul ignore next -- @preserve */
            throw new TypeError('node.ownerDocument is undefined but node is not a Document');
        }

        return node.ownerDocument;
    },

    newDocument(document?: Document): Document {
        if (!document) {
            document = getDom().createDocument(null, null, null);
        }

        return document;
    },

    newDocumentContent(content: string): Document {
        if (content === '') {
            throw new SyntaxError('Received xml string argument is empty');
        }

        const parser = getParser();
        try {
            const documentParse = parser.parseFromString(content, 'text/xml');

            // eslint-disable-next-line unicorn/prefer-query-selector
            if (documentParse.getElementsByTagName('parsererror').length > 0) {
                throw new Error('Error parsing XML');
            }

            return Xml.newDocument(documentParse);
        } catch (error) {
            throw new SyntaxError(`Cannot create a Document from xml string, errors: ${JSON.stringify(error)}`);
        }
    },

    isValidXmlName(name: string): boolean {
        if (name === '') {
            return false;
        }

        return /^[\p{L}_:][\p{L}\d_:.-]*$/u.test(name);
    },

    createElement(document: Document, name: string, content = ''): Element {
        return Xml.createDOMElement(
            () => {
                if (!name) {
                    throw new SyntaxError('Empty Name');
                }

                return document.createElement(name);
            },
            `Cannot create element with name ${name}`,
            content,
        );
    },

    createDOMElement(makeElement: () => Element, errorMessage: string, content: string): Element {
        let element: Element | undefined;
        let previousException: Error | undefined;
        try {
            element = makeElement();
        } catch (error) {
            previousException = error as Error;
        }

        if (!element || !DomValidators.isElement(element)) {
            throw new SyntaxError(
                `${errorMessage} on ${previousException ? previousException.message : 'not is element'}`,
            );
        }

        if (content !== '') {
            element.appendChild(Xml.ownerDocument(element).createTextNode(content));
        }

        return element;
    },
};

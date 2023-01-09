import { DOMImplementation } from '@xmldom/xmldom';
import { DomValidators } from '~/utils/dom-validators';

describe('DomValidators', () => {
    let document: Document;
    let element: Element;
    let attribute: Attr;
    beforeEach(() => {
        document = new DOMImplementation().createDocument('', '');
        element = document.createElement('myNode');
        element.setAttribute('name', 'first');
        attribute = element.attributes.getNamedItem('name')!;
    });

    test('is element', () => {
        expect(DomValidators.isElement(document)).toBeFalsy();
        expect(DomValidators.isElement(element)).toBeTruthy();
        expect(DomValidators.isElement(attribute)).toBeFalsy();
    });

    test('is document', () => {
        expect(DomValidators.isDocument(document)).toBeTruthy();
        expect(DomValidators.isDocument(element)).toBeFalsy();
        expect(DomValidators.isDocument(attribute)).toBeFalsy();
    });

    test('is attr', () => {
        expect(DomValidators.isAttr(document)).toBeFalsy();
        expect(DomValidators.isAttr(element)).toBeFalsy();
        expect(DomValidators.isAttr(attribute)).toBeTruthy();
    });

    test('is text', () => {
        expect(DomValidators.isText(document)).toBeFalsy();
        expect(DomValidators.isText(element)).toBeFalsy();
        expect(DomValidators.isText(attribute)).toBeFalsy();

        const textNode = document.createTextNode('first');
        expect(DomValidators.isText(textNode)).toBeTruthy();
    });
});
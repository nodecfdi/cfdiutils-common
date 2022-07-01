import { DOMImplementation } from '@xmldom/xmldom';
import { DomValidators } from '~/index';

describe('DomValidators', () => {
    let document: Document;
    let element: Element;
    let attr: Attr;
    beforeEach(() => {
        document = new DOMImplementation().createDocument('', '');
        element = document.createElement('myNode');
        element.setAttribute('name', 'first');
        attr = element.attributes.getNamedItem('name') as Attr;
    });

    test('is element', () => {
        expect(DomValidators.isElement(document)).toBeFalsy();
        expect(DomValidators.isElement(element)).toBeTruthy();
        expect(DomValidators.isElement(attr)).toBeFalsy();
    });

    test('is document', () => {
        expect(DomValidators.isDocument(document)).toBeTruthy();
        expect(DomValidators.isDocument(element)).toBeFalsy();
        expect(DomValidators.isDocument(attr)).toBeFalsy();
    });

    test('is attr', () => {
        expect(DomValidators.isAttr(document)).toBeFalsy();
        expect(DomValidators.isAttr(element)).toBeFalsy();
        expect(DomValidators.isAttr(attr)).toBeTruthy();
    });

    test('is text', () => {
        expect(DomValidators.isText(document)).toBeFalsy();
        expect(DomValidators.isText(element)).toBeFalsy();
        expect(DomValidators.isText(attr)).toBeFalsy();

        const textNode = document.createTextNode('first');
        expect(DomValidators.isText(textNode)).toBeTruthy();
    });
});

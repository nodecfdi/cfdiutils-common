import { DomValidators } from 'src/utils/dom-validators';

describe('dom_validators_with_jsdom', () => {
    let documentJSDom: Document;
    let element: Element;
    let attribute: Attr;

    beforeEach(() => {
        documentJSDom = document.implementation.createDocument('', '');
        element = documentJSDom.createElement('myNode');
        element.setAttribute('name', 'first');
        attribute = element.attributes.getNamedItem('name') as Attr;
    });

    test('is_element', () => {
        expect(DomValidators.isElement(documentJSDom)).toBeFalsy();
        expect(DomValidators.isElement(element)).toBeTruthy();
        expect(DomValidators.isElement(attribute)).toBeFalsy();
    });

    test('is_document', () => {
        expect(DomValidators.isDocument(documentJSDom)).toBeTruthy();
        expect(DomValidators.isDocument(element)).toBeFalsy();
        expect(DomValidators.isDocument(attribute)).toBeFalsy();
    });

    test('is_attr', () => {
        expect(DomValidators.isAttr(documentJSDom)).toBeFalsy();
        expect(DomValidators.isAttr(element)).toBeFalsy();
        expect(DomValidators.isAttr(attribute)).toBeTruthy();
    });

    test('is_text', () => {
        expect(DomValidators.isText(documentJSDom)).toBeFalsy();
        expect(DomValidators.isText(element)).toBeFalsy();
        expect(DomValidators.isText(attribute)).toBeFalsy();

        const textNode = documentJSDom.createTextNode('first');
        expect(DomValidators.isText(textNode)).toBeTruthy();
    });
});

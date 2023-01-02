/**
 * @vitest-environment jsdom
 */

import { DomValidators } from '~/utils/dom-validators';

describe('DomValidators with jsdom', () => {
    let documentJSDom: Document;
    let element: Element;
    let attribute: Attr;

    beforeEach(() => {
        documentJSDom = document.implementation.createDocument('', '');
        element = documentJSDom.createElement('myNode');
        element.setAttribute('name', 'first');
        attribute = element.attributes.getNamedItem('name')!;
    });

    test('is element', () => {
        expect(DomValidators.isElement(documentJSDom)).toBeFalsy();
        expect(DomValidators.isElement(element)).toBeTruthy();
        expect(DomValidators.isElement(attribute)).toBeFalsy();
    });

    test('is document', () => {
        expect(DomValidators.isDocument(documentJSDom)).toBeTruthy();
        expect(DomValidators.isDocument(element)).toBeFalsy();
        expect(DomValidators.isDocument(attribute)).toBeFalsy();
    });

    test('is attr', () => {
        expect(DomValidators.isAttr(documentJSDom)).toBeFalsy();
        expect(DomValidators.isAttr(element)).toBeFalsy();
        expect(DomValidators.isAttr(attribute)).toBeTruthy();
    });

    test('is text', () => {
        expect(DomValidators.isText(documentJSDom)).toBeFalsy();
        expect(DomValidators.isText(element)).toBeFalsy();
        expect(DomValidators.isText(attribute)).toBeFalsy();

        const textNode = documentJSDom.createTextNode('first');
        expect(DomValidators.isText(textNode)).toBeTruthy();
    });
});

import { DomValidators } from 'src/utils/dom-validators';

describe('dom_validators_with_jsdom', () => {
  let documentJsDom: Document;
  let element: Element;
  let attribute: Attr;

  beforeEach(() => {
    documentJsDom = document.implementation.createDocument('', '');
    element = documentJsDom.createElement('myNode');
    element.setAttribute('name', 'first');
    attribute = element.attributes.getNamedItem('name')!;
  });

  test('is_element', () => {
    expect(DomValidators.isElement(documentJsDom)).toBeFalsy();
    expect(DomValidators.isElement(element)).toBeTruthy();
    expect(DomValidators.isElement(attribute)).toBeFalsy();
  });

  test('is_document', () => {
    expect(DomValidators.isDocument(documentJsDom)).toBeTruthy();
    expect(DomValidators.isDocument(element)).toBeFalsy();
    expect(DomValidators.isDocument(attribute)).toBeFalsy();
  });

  test('is_attr', () => {
    expect(DomValidators.isAttr(documentJsDom)).toBeFalsy();
    expect(DomValidators.isAttr(element)).toBeFalsy();
    expect(DomValidators.isAttr(attribute)).toBeTruthy();
  });

  test('is_text', () => {
    expect(DomValidators.isText(documentJsDom)).toBeFalsy();
    expect(DomValidators.isText(element)).toBeFalsy();
    expect(DomValidators.isText(attribute)).toBeFalsy();

    const textNode = documentJsDom.createTextNode('first');
    expect(DomValidators.isText(textNode)).toBeTruthy();
  });
});

import { Xml } from '../../../src';
import { DOMImplementation, XMLSerializer } from '@xmldom/xmldom';

describe('Utils.Xml', () => {
    test.each([['First_Name'], ['_4-lane'], ['tél'], ['month-day']])('true on valid names', (name) => {
        expect(Xml.isValidXmlName(name)).toBeTruthy();
    });

    test.each([['Driver´s_License'], ['month/day'], ['first name'], ['4-lane']])('false on invalid names', (name) => {
        expect(Xml.isValidXmlName(name)).toBeFalsy();
    });

    test('method newDocumentContent with invalid xml', () => {
        const xmlInvalid = '<xml a="1" a="2"></xml>';
        expect(() => Xml.newDocumentContent(xmlInvalid)).toThrow('Cannot create a Document from xml string');
    });

    test('method documentElement without root element', () => {
        expect(() => Xml.documentElement(Xml.newDocument())).toThrow('Document does not have root element');
    });

    test('method documentElement with root element', () => {
        const document = new DOMImplementation().createDocument('', '');
        const root = document.createElement('root');
        document.appendChild(root);
        expect(Xml.documentElement(document)).toStrictEqual(root);
    });

    test.each([
        ['', ''],
        ['foo', 'foo'],
        ['&amp;', '&'],
        ['&lt;', '<'],
        //['&gt;', '>'], // bug xmldom parser not fixed encoding for > to &gt; today 02/12/2021
        ["'", "'"],
        ['"', '"'],
        ['&amp;copy;', '&copy;'],
        ['foo &amp; bar', 'foo & bar'],
    ])('method createElement', (expected, content) => {
        const elementName = 'element';
        const document = Xml.newDocument();
        const element = Xml.createElement(document, elementName, content);
        document.appendChild(element);
        expect(element.textContent).toBe(content);

        const rawXml = new XMLSerializer().serializeToString(document);
        // fixed self-closing tags to full closing tags
        const fixedXml = rawXml.replace(/<(.*?)\s*\/>/g, '<$1></$1>');
        expect(fixedXml).toBe(`<${elementName}>${expected}</${elementName}>`);
    });

    test('method createElement with bad name', () => {
        const document = Xml.newDocument();
        expect(() => Xml.createElement(document, '')).toThrow('Cannot create element');
    });
});

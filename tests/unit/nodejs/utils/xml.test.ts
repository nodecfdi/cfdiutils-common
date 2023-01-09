import { DOMImplementation, DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { install } from '~/dom';
import { DOMNotFoundError } from '~/exceptions/dom-not-found-error';
import { Xml } from '~/utils/xml';

describe('Xml Util', () => {
    const provideElementMake: string[][] = [
        ['', ''],
        ['foo', 'foo'],
        ['&amp;', '&'],
        ['&lt;', '<'],
        ['&gt;', '>'],
        ["'", "'"],
        ['"', '"'],
        ['&amp;copy;', '&copy;'],
        ['foo &amp; bar', 'foo & bar']
    ];

    beforeEach(() => {
        // Restart DOM definitions install
        install();
    });

    test.each([['First_Name'], ['_4-lane'], ['tél'], ['month-day']])('true on valid names', (name) => {
        expect(Xml.isValidXmlName(name)).toBeTruthy();
    });

    test.each([['Driver`s_License'], ['month/day'], ['first name'], ['4-lane']])('false on invalid names', (name) => {
        expect(Xml.isValidXmlName(name)).toBeFalsy();
    });

    test('method ownerDocument return same document', () => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());

        const document = Xml.newDocument();

        expect(Xml.ownerDocument(document)).toBe(document);
    });

    test('method newDocumentContent throw error if not install dom', () => {
        const xmlInvalid = '<xml a="1" a="2"></xml>';
        const t = (): void => {
            Xml.newDocumentContent(xmlInvalid);
        };

        expect(t).toThrow(DOMNotFoundError);
        expect(t).toThrow('DOMParser');
    });

    test('method newDocumentContent with empty xml', () => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
        const xmlEmpty = '';
        expect(() => Xml.newDocumentContent(xmlEmpty)).toThrow('Received xml string argument is empty');
    });

    test('method newDocumentContent with invalid xml', () => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
        const xmlInvalid = '<xml a="1" a="2"></xml>';
        expect(() => Xml.newDocumentContent(xmlInvalid)).toThrow('Cannot create a Document from xml string');
    });

    test('method documentElement throw error if not install dom', () => {
        const t = (): void => {
            Xml.newDocument();
        };

        expect(t).toThrow(DOMNotFoundError);
        expect(t).toThrow('DOMImplementation');
    });

    test('method documentElement without root element', () => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
        expect(() => Xml.documentElement(Xml.newDocument())).toThrow('Document does not have root element');
    });

    test('method documentElement with root element', () => {
        const document = new DOMImplementation().createDocument('', '');
        const root = document.createElement('root');
        document.appendChild(root);
        expect(Xml.documentElement(document)).toStrictEqual(root);
    });

    test.each(provideElementMake)('method createElement with xmldom', (expected, content) => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
        const elementName = 'element';
        const document = Xml.newDocument();
        const element = Xml.createElement(document, elementName, content);
        document.appendChild(element);
        expect(element.textContent).toBe(content);

        const rawXml = new XMLSerializer().serializeToString(document);

        // Fixed self-closing tags to full closing tags
        const fixedXml = rawXml.replace(/<(.*?)\s*\/>/g, '<$1></$1>');
        expect(fixedXml).toBe(`<${elementName}>${expected}</${elementName}>`);
    });

    test('method createElement with bad name', () => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
        const document = Xml.newDocument();
        expect(() => Xml.createElement(document, '')).toThrow('Cannot create element');
    });
});

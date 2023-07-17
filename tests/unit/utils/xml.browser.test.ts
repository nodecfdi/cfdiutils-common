import { install } from 'src/dom';
import { DOMNotFoundError } from 'src/exceptions/dom-not-found-error';
import { Xml } from 'src/utils/xml';

describe('xml_util_with_jsdom', () => {
    const provideElementMake: string[][] = [
        ['empty', '', ''],
        ['foo', 'foo', 'foo'],
        ['ampersand', '&amp;', '&'],
        ['<', '&lt;', '<'],
        ['>', '&gt;', '>'],
        ['comilla_simple', "'", "'"],
        ['comilla_doble', '"', '"'],
        ['&copy;', '&amp;copy;', '&copy;'],
        ['mixed', 'foo &amp; bar', 'foo & bar'],
    ];

    beforeEach(() => {
        // Restart DOM definitions install
        install();
    });

    test.each([['First_Name'], ['_4-lane'], ['tél'], ['month-day']])('true_on_valid_names_%s', (name) => {
        expect(Xml.isValidXmlName(name)).toBeTruthy();
    });

    test.each([['Driver`s_License'], ['month/day'], ['first name'], ['4-lane']])(
        'false_on_invalid_names_%s',
        (name) => {
            expect(Xml.isValidXmlName(name)).toBeFalsy();
        },
    );

    test('method_ownerDocument_return_same_document', () => {
        install(new DOMParser(), new XMLSerializer(), document.implementation);

        const jsDocument = Xml.newDocument();

        expect(Xml.ownerDocument(jsDocument)).toBe(jsDocument);
    });

    test('method_newDocumentContent_throw_error_if_not_install_dom', () => {
        const xmlInvalid = '<xml a="1" a="2"></xml>';
        const t = (): void => {
            Xml.newDocumentContent(xmlInvalid);
        };

        expect(t).toThrow(DOMNotFoundError);
        expect(t).toThrow('DOMParser');
    });

    test('method_newDocumentContent_with_empty_xml', () => {
        install(new DOMParser(), new XMLSerializer(), document.implementation);
        const xmlEmpty = '';
        expect(() => Xml.newDocumentContent(xmlEmpty)).toThrow('Received xml string argument is empty');
    });

    test('method_newDocumentContent_with_invalid_xml', () => {
        install(new DOMParser(), new XMLSerializer(), document.implementation);
        const xmlInvalid = '<xml a="1" a="2"></xml>';
        expect(() => Xml.newDocumentContent(xmlInvalid)).toThrow('Cannot create a Document from xml string');
    });

    test('method_documentElement_throw_error_if_not_install_dom', () => {
        const t = (): void => {
            Xml.newDocument();
        };

        expect(t).toThrow(DOMNotFoundError);
        expect(t).toThrow('DOMImplementation');
    });

    test('method_documentElement_without_root_element', () => {
        install(new DOMParser(), new XMLSerializer(), document.implementation);
        expect(() => Xml.documentElement(Xml.newDocument())).toThrow('Document does not have root element');
    });

    test('method_documentElement_with_root_element', () => {
        const jsDocument = document.implementation.createDocument('', '');
        const root = jsDocument.createElement('root');
        jsDocument.appendChild(root);
        expect(Xml.documentElement(jsDocument)).toStrictEqual(root);
    });

    test.each(provideElementMake)('method_createElement_with_jsdom_%s', (_name, expected, content) => {
        const jsDOMParser = new DOMParser();
        const jsXMLSerializer = new XMLSerializer();
        const jsDOMImplementation = document.implementation;
        install(jsDOMParser, jsXMLSerializer, jsDOMImplementation);

        const elementName = 'element';
        const jsDocument = Xml.newDocument();
        const element = Xml.createElement(jsDocument, elementName, content);
        jsDocument.appendChild(element);
        expect(element.textContent).toBe(content);

        const rawXml = new XMLSerializer().serializeToString(jsDocument);
        // Fixed self-closing tags to full closing tags
        const fixedXml = rawXml.replaceAll(/<(.*?)\s*\/>/g, '<$1></$1>');
        expect(fixedXml).toBe(`<${elementName}>${expected}</${elementName}>`);
    });

    test('method_createElement_with_bad_name', () => {
        install(new DOMParser(), new XMLSerializer(), document.implementation);
        const jsDocument = Xml.newDocument();
        expect(() => Xml.createElement(jsDocument, '')).toThrow('Cannot create element');
    });
});

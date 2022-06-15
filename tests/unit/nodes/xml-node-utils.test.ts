import 'jest-xml-matcher';
import { XMLSerializer } from '@xmldom/xmldom';
import { readFileSync } from 'fs';
import { useTestCase } from '../../test-case';
import { CNode, Xml, XmlNodeUtils } from '../../../src';

const { utilAsset } = useTestCase();

describe('XmlNodeUtils', () => {
    test('node to Xml string Xml Header', () => {
        const node = new CNode('book', {}, [new CNode('chapter', { toc: '1' }), new CNode('chapter', { toc: '2' })]);

        let xmlString = XmlNodeUtils.nodeToXmlString(node, true);
        expect(xmlString.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBeTruthy();

        xmlString = XmlNodeUtils.nodeToXmlString(node, false);
        expect(xmlString.startsWith('<book>')).toBeTruthy();
    });

    test.each([
        ['simple-xml', utilAsset('nodes/sample.xml')],
        ['with-texts-xml', utilAsset('nodes/sample-with-texts.xml')],
        ['cfdi', utilAsset('cfdi33.xml')],
    ])('export from file and export again %s', (title: string, filename: string) => {
        const source = readFileSync(filename, 'utf-8');

        const document = Xml.newDocumentContent(source);

        // create node from element
        const node = XmlNodeUtils.nodeFromXmlElement(Xml.documentElement(document));

        // create element from node
        const element = XmlNodeUtils.nodeToXmlElement(node);
        const xmlString = XmlNodeUtils.nodeToXmlString(node);

        // compare versus source
        const xmlSave = new XMLSerializer().serializeToString(element.ownerDocument);

        expect(xmlSave).toEqualXML(source);
        expect(xmlString).toEqualXML(source);
    });

    test('node from xml string', () => {
        const node = new CNode('book', {}, [new CNode('chapter', { toc: '1' }), new CNode('chapter', { toc: '2' })]);
        const xmlString = XmlNodeUtils.nodeToXmlString(node, true);
        const resultNode = XmlNodeUtils.nodeFromXmlString(xmlString);
        expect(resultNode.name()).toBe(node.name());
        expect(resultNode.searchAttribute('chapter', 'toc')).toBe('1');
    });

    test('import xml with namespace without prefix', () => {
        const file = utilAsset('xml-with-namespace-definitions-at-child-level.xml');
        const node = XmlNodeUtils.nodeFromXmlString(readFileSync(file, 'utf-8'));
        const inspected = node.searchNode('base:Third', 'innerNS');
        if (!inspected) {
            fail('The specimen does not have the required test case');
        }
        expect(inspected.get('xmlns')).toBe('http://external.com/inner');
    });

    test('xml with value with special chars', () => {
        const expectedValue = 'ampersand: &';
        const content = '<root>ampersand: &amp;</root>';

        const node = XmlNodeUtils.nodeFromXmlString(content);

        expect(node.value()).toEqual(expectedValue);
        expect(XmlNodeUtils.nodeToXmlString(node)).toBe(content);
    });

    test('xml with value with inner comment', () => {
        const expectedValue = 'ampersand: &';
        const content = '<root>ampersand: <!-- comment -->&amp;</root>';
        const expectedContent = '<root>ampersand: &amp;</root>';

        const node = XmlNodeUtils.nodeFromXmlString(content);

        expect(node.value()).toEqual(expectedValue);
        expect(XmlNodeUtils.nodeToXmlString(node)).toBe(expectedContent);
    });

    test('xml with value with inner white space', () => {
        const expectedValue = '\n\nfirst line\n\tsecond line\n\t third line \t\nfourth line\n\n';
        const content = `<root>${expectedValue}</root>`;

        const node = XmlNodeUtils.nodeFromXmlString(content);

        expect(node.value()).toEqual(expectedValue);
        expect(XmlNodeUtils.nodeToXmlString(node)).toBe(content);
    });

    test('xml with value with inner element', () => {
        const expectedValue = 'ampersand: &';
        const content = '<root>ampersand: <inner/>&amp;</root>';
        const expectedContent = '<root><inner/>ampersand: &amp;</root>';

        const node = XmlNodeUtils.nodeFromXmlString(content);

        expect(node.value()).toEqual(expectedValue);
        expect(XmlNodeUtils.nodeToXmlString(node)).toBe(expectedContent);
    });
});

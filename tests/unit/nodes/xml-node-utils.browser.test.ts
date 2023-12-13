/* eslint-disable import/no-unassigned-import */
import { readFileSync } from 'node:fs';
import 'jest-xml-matcher';
import { install } from 'src/dom';
import { Node } from 'src/nodes/node';
import { XmlNodeUtils } from 'src/nodes/xml-node-utils';
import { Xml } from 'src/utils/xml';
import { useTestCase } from '../../test-case.js';

describe('xml_node_utils_with_jsdom', () => {
  const { utilAsset } = useTestCase();

  beforeEach(() => {
    install(new DOMParser(), new XMLSerializer(), document.implementation);
  });

  test('node_to_xml_string_xml_header', () => {
    const node = new Node('book', {}, [new Node('chapter', { toc: '1' }), new Node('chapter', { toc: '2' })]);

    let xmlString = XmlNodeUtils.nodeToXmlString(node, true);
    expect(xmlString.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBeTruthy();

    xmlString = XmlNodeUtils.nodeToXmlString(node, false);
    expect(xmlString.startsWith('<book>')).toBeTruthy();
  });

  test.each([
    ['simple-xml', utilAsset('nodes/sample.xml')],
    ['with_texts_xml', utilAsset('nodes/sample-with-texts.xml')],
    ['cfdi', utilAsset('cfdi33.xml')],
  ])('export_from_file_and_export_again_%s', (_name, filename) => {
    const source = readFileSync(filename, 'utf8');

    const document = Xml.newDocumentContent(source);

    // Create node from element
    const node = XmlNodeUtils.nodeFromXmlElement(Xml.documentElement(document));

    // Create element from node
    const element = XmlNodeUtils.nodeToXmlElement(node);
    const xmlString = XmlNodeUtils.nodeToXmlString(node);

    // Compare versus source
    const xmlSave = new XMLSerializer().serializeToString(element.ownerDocument);

    expect(xmlSave).toEqualXML(source);
    expect(xmlString).toEqualXML(source);
  });

  test('node_from_xml_string', () => {
    const node = new Node('book', {}, [new Node('chapter', { toc: '1' }), new Node('chapter', { toc: '2' })]);
    const xmlString = XmlNodeUtils.nodeToXmlString(node, true);
    const resultNode = XmlNodeUtils.nodeFromXmlString(xmlString);
    expect(resultNode.name()).toBe(node.name());
    expect(resultNode.searchAttribute('chapter', 'toc')).toBe('1');
  });

  test('import_xml_with_namespace_without_prefix', () => {
    const file = utilAsset('xml-with-namespace-definitions-at-child-level.xml');
    const node = XmlNodeUtils.nodeFromXmlString(readFileSync(file, 'utf8'));
    const inspected = node.searchNode('base:Third', 'innerNS');
    if (!inspected) {
      throw new Error('The specimen does not have the required test case');
    }

    expect(inspected.get('xmlns')).toBe('http://external.com/inner');
  });

  test('xml_with_value_with_special_chars', () => {
    const expectedValue = 'ampersand: &';
    const content = '<root>ampersand: &amp;</root>';

    const node = XmlNodeUtils.nodeFromXmlString(content);

    expect(node.value()).toEqual(expectedValue);
    expect(XmlNodeUtils.nodeToXmlString(node)).toBe(content);
  });

  test('xml_with_value_with_inner_comment', () => {
    const expectedValue = 'ampersand: &';
    const content = '<root>ampersand: <!-- comment -->&amp;</root>';
    const expectedContent = '<root>ampersand: &amp;</root>';

    const node = XmlNodeUtils.nodeFromXmlString(content);

    expect(node.value()).toEqual(expectedValue);
    expect(XmlNodeUtils.nodeToXmlString(node)).toBe(expectedContent);
  });

  test('xml_with_value_with_inner_white_space', () => {
    const expectedValue = '\n\nfirst line\n\tsecond line\n\t third line \t\nfourth line\n\n';
    const content = `<root>${expectedValue}</root>`;

    const node = XmlNodeUtils.nodeFromXmlString(content);

    expect(node.value()).toEqual(expectedValue);
    expect(XmlNodeUtils.nodeToXmlString(node)).toBe(content);
  });

  test('xml_with_value_with_inner_element', () => {
    const expectedValue = 'ampersand: &';
    const content = '<root>ampersand: <inner/>&amp;</root>';
    const expectedContent = '<root><inner/>ampersand: &amp;</root>';

    const node = XmlNodeUtils.nodeFromXmlString(content);

    expect(node.value()).toEqual(expectedValue);
    expect(XmlNodeUtils.nodeToXmlString(node)).toBe(expectedContent);
  });
});

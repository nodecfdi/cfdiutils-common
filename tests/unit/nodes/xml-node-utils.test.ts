import { CNode, XmlNodeUtils } from '../../../src';

describe('XmlNodeUtils', () => {
    test('node to Xml string Xml Header', () => {
        const node = new CNode('book', {}, [new CNode('chapter', { toc: '1' }), new CNode('chapter', { toc: '2' })]);

        let xmlString = XmlNodeUtils.nodeToXmlString(node, true);
        expect(xmlString.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBeTruthy();

        xmlString = XmlNodeUtils.nodeToXmlString(node, false);
        expect(xmlString.startsWith('<book>')).toBeTruthy();
    });

    test('node from xml string', () => {
        const node = new CNode('book', {}, [new CNode('chapter', { toc: '1' }), new CNode('chapter', { toc: '2' })]);
        const xmlString = XmlNodeUtils.nodeToXmlString(node, true);
        const resultNode = XmlNodeUtils.nodeFromXmlString(xmlString);
        expect(resultNode.name()).toBe(node.name());
        expect(resultNode.searchAttribute('chapter', 'toc')).toBe('1');
    });
});

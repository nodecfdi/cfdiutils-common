import { install, getDom, getParser, getSerializer, DOMNotFoundError } from '~/index';
import { DOMImplementation, DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { JSDOM } from 'jsdom';

describe('dom agnostic', () => {
    test('getDom getParser and getSerializer will be throw error on not install', () => {
        // reset install only jest need
        install();

        expect(() => getDom()).toThrow(DOMNotFoundError);
        expect(() => getParser()).toThrow(DOMNotFoundError);
        expect(() => getSerializer()).toThrow(DOMNotFoundError);
    });

    test('getDom getParser and getSerializer will be throw error with specific type', () => {
        // reset install only jest need
        install();

        expect(() => getDom()).toThrow('DOMImplementation');
        expect(() => getParser()).toThrow('DOMParser');
        expect(() => getSerializer()).toThrow('XMLSerializer');
    });

    test('using xmlDom return same', () => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());

        expect(getDom()).toBeInstanceOf(DOMImplementation);
        expect(getParser()).toBeInstanceOf(DOMParser);
        expect(getSerializer()).toBeInstanceOf(XMLSerializer);
    });

    test('using jsdom return same', () => {
        const dom = new JSDOM();
        const jsDOMParser = new dom.window.DOMParser();
        const jsXMLSerializer = new dom.window.XMLSerializer();
        const jsDOMImplementation = dom.window.document.implementation;
        install(jsDOMParser, jsXMLSerializer, jsDOMImplementation);

        expect(getDom()).toBe(jsDOMImplementation);
        expect(getParser()).toBe(jsDOMParser);
        expect(getSerializer()).toBe(jsXMLSerializer);
    });
});

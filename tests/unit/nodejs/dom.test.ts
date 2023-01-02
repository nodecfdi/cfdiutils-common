import { DOMImplementation, DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { getDom, getParser, getSerializer, install } from '~/dom';
import { DOMNotFoundError } from '~/exceptions/dom-not-found-error';

describe('dom agnostic', () => {
    test('getDom getParser and getSerializer will be throw error on not install', () => {
        expect(() => getDom()).toThrow(DOMNotFoundError);
        expect(() => getParser()).toThrow(DOMNotFoundError);
        expect(() => getSerializer()).toThrow(DOMNotFoundError);
    });

    test('getDom getParser and getSerializer will be throw error with specific type', () => {
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
});

/**
 * \@vitest-environment jsdom
 */

import { getDom, getParser, getSerializer, install } from '~/dom';
import { DOMNotFoundError } from '~/exceptions/dom-not-found-error';

describe('dom agnostic on browser with jsdom', () => {
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

    test('using browser usage with jsdom return dom expected', () => {
        const jsDOMParser = new DOMParser();
        const jsXMLSerializer = new XMLSerializer();
        const jsDOMImplementation = document.implementation;
        install(jsDOMParser, jsXMLSerializer, jsDOMImplementation);

        expect(jsDOMParser).not.toBeUndefined();
        expect(jsXMLSerializer).not.toBeUndefined();
        expect(jsDOMImplementation).not.toBeUndefined();
        expect(getDom()).toBe(jsDOMImplementation);
        expect(getParser()).toBe(jsDOMParser);
        expect(getSerializer()).toBe(jsXMLSerializer);
    });
});

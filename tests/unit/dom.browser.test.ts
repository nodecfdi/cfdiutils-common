import { getDom, getParser, getSerializer, install } from 'src/dom';
import { DOMNotFoundError } from 'src/exceptions/dom-not-found-error';

describe('dom_with_jsdom', () => {
    test('getDom_getParser_and_getSerializer_will_be_throw_error_on_not_install', () => {
        expect(() => getDom()).toThrow(DOMNotFoundError);
        expect(() => getParser()).toThrow(DOMNotFoundError);
        expect(() => getSerializer()).toThrow(DOMNotFoundError);
    });

    test('getDom_getParser_and_getSerializer_will_be_throw_error_with_specific_type', () => {
        expect(() => getDom()).toThrow('DOMImplementation');
        expect(() => getParser()).toThrow('DOMParser');
        expect(() => getSerializer()).toThrow('XMLSerializer');
    });

    test('using_browser_usage_with_jsdom_return_dom_expected', () => {
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

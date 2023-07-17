import { DOMImplementation, DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { getDom, getParser, getSerializer, install } from 'src/dom';
import { DOMNotFoundError } from 'src/exceptions/dom-not-found-error';

describe('dom_with_xmldom', () => {
    test('geDom_getParser_and_getSerializer_will_be_throw_error_on_not_install', () => {
        expect(() => getDom()).toThrow(DOMNotFoundError);
        expect(() => getParser()).toThrow(DOMNotFoundError);
        expect(() => getSerializer()).toThrow(DOMNotFoundError);
    });

    test('getDom_getParser_and_getSerializer_will_be_throw_error_with_specific_type', () => {
        expect(() => getDom()).toThrow('DOMImplementation');
        expect(() => getParser()).toThrow('DOMParser');
        expect(() => getSerializer()).toThrow('XMLSerializer');
    });

    test('using_xmlDom_return_same', () => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());

        expect(getDom()).toBeInstanceOf(DOMImplementation);
        expect(getParser()).toBeInstanceOf(DOMParser);
        expect(getSerializer()).toBeInstanceOf(XMLSerializer);
    });
});

import { getDom, getParser, getSerializer, install } from 'src/dom';
import { DomNotFoundError } from 'src/exceptions/dom-not-found-error';

describe('dom_with_jsdom', () => {
  test('getDom_getParser_and_getSerializer_will_be_throw_error_on_not_install', () => {
    expect(() => getDom()).toThrow(DomNotFoundError);
    expect(() => getParser()).toThrow(DomNotFoundError);
    expect(() => getSerializer()).toThrow(DomNotFoundError);
  });

  test('getDom_getParser_and_getSerializer_will_be_throw_error_with_specific_type', () => {
    expect(() => getDom()).toThrow('DOMImplementation');
    expect(() => getParser()).toThrow('DOMParser');
    expect(() => getSerializer()).toThrow('XMLSerializer');
  });

  test('using_browser_usage_with_jsdom_return_dom_expected', () => {
    const jsDomParser = new DOMParser();
    const jsXmlSerializer = new XMLSerializer();
    const jsDomImplementation = document.implementation;
    install(jsDomParser, jsXmlSerializer, jsDomImplementation);

    expect(jsDomParser).not.toBeUndefined();
    expect(jsXmlSerializer).not.toBeUndefined();
    expect(jsDomImplementation).not.toBeUndefined();
    expect(getDom()).toBe(jsDomImplementation);
    expect(getParser()).toBe(jsDomParser);
    expect(getSerializer()).toBe(jsXmlSerializer);
  });
});

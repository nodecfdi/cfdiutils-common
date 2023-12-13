import { DomNotFoundError } from './exceptions/dom-not-found-error.js';

let _dom: DOMImplementation | undefined;
let _parser: DOMParser | undefined;
let _serializer: XMLSerializer | undefined;

/**
 * Get instance of DOMParser
 *
 * @returns the current DOMParser object
 *
 * @throws {@link DomNotFoundError} This exception is throw if not install DOMParser.
 */
const getParser = (): DOMParser => {
  if (!_parser) {
    throw new DomNotFoundError('DOMParser');
  }

  return _parser;
};

/**
 * Get instance of XMLSerializer
 *
 * @returns the current XMLSerializer object
 *
 * @throws {@link DomNotFoundError} This exception is throw if not install XMLSerializer.
 */
const getSerializer = (): XMLSerializer => {
  if (!_serializer) {
    throw new DomNotFoundError('XMLSerializer');
  }

  return _serializer;
};

/**
 * Get instance of DOMImplementation
 *
 * @returns the current DOMImplementation object
 *
 * @throws {@link DomNotFoundError} This exception is throw if not install DOMImplementation.
 */
const getDom = (): DOMImplementation => {
  if (!_dom) {
    throw new DomNotFoundError('DOMImplementation');
  }

  return _dom;
};

/**
 * Install DOM instances for usage on this library
 */
const install = (parser?: DOMParser, serializer?: XMLSerializer, dom?: DOMImplementation): void => {
  _parser = parser;
  _serializer = serializer;
  _dom = dom;
};

export { getParser, getSerializer, getDom, install };

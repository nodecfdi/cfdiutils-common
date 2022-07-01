import { DOMNotFoundError } from '~/exceptions/dom-not-found-error';

let _dom: DOMImplementation | undefined;
let _parser: DOMParser | undefined;
let _serializer: XMLSerializer | undefined;

/**
 * Get instance of DOMParser
 *
 * @returns the current DOMParser object
 *
 * @throws {@link DOMNotFoundError} This exception is throw if not install DOMParser.
 */
const getParser = (): DOMParser => {
    if (!_parser) {
        throw new DOMNotFoundError('DOMParser');
    }

    return _parser;
};

const getSerializer = (): XMLSerializer => {
    if (!_serializer) {
        throw new DOMNotFoundError('XMLSerializer');
    }

    return _serializer;
};

const getDom = (): DOMImplementation => {
    if (!_dom) {
        throw new DOMNotFoundError('DOMImplementation');
    }

    return _dom;
};

const install = (parser?: DOMParser, serializer?: XMLSerializer, dom?: DOMImplementation): void => {
    _parser = parser;
    _serializer = serializer;
    _dom = dom;
};

export { getParser, getSerializer, getDom, install };

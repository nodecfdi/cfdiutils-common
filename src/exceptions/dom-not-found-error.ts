/**
 * DOMNotFoundError exception. For not provided dom resolver.
 * @public
 */
export class DOMNotFoundError extends Error {
    /**
     *
     */
    constructor(type: 'DOMParser' | 'XMLSerializer' | 'DOMImplementation') {
        super(`No ${type} was provided.`);
        this.name = `${type}NotFoundError`;
    }
}

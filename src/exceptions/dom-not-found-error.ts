/**
 * DOMNotFoundError exception. For not provided dom resolver.
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

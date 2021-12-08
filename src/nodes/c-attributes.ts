import { Xml } from '../utils/xml';

export class CAttributes extends Map<string, string> {
    static get [Symbol.species]() {
        return Map;
    }

    constructor(attributes: Record<string, unknown> = {}) {
        super();
        this.importRecord(attributes);
    }

    public get(name: string): string | undefined {
        if (!this.has(name)) {
            return '';
        }
        return super.get(name);
    }

    public set(name: string, value: unknown = null): this {
        if (value === null) {
            this.delete(name);
            return this;
        }
        if (!Xml.isValidXmlName(name)) {
            throw new SyntaxError(`Cannot set attribute with an invalid xml name: ${name}`);
        }
        super.set(name, `${value}`);
        return this;
    }

    public importRecord(attributes: Record<string, unknown>): this {
        if (attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
                const fixedValue = CAttributes.castValueToString(key, value);
                this.set(key, fixedValue);
            });
        }
        return this;
    }

    public exportRecord(): Record<string, string> {
        const jsonResponse: Record<string, string> = {};
        for (const [key, val] of this.entries()) {
            jsonResponse[key] = val;
        }
        return jsonResponse;
    }

    /**
     * Cast any value to string
     *
     * @param key
     * @param value
     * @private
     */
    private static castValueToString(key: string, value: unknown): null | string {
        if (value === null || value === undefined) {
            return null;
        }
        if (/boolean|number|string/.test(typeof value)) {
            return `${value}`;
        }
        if (typeof value === 'object' && !Array.isArray(value)) {
            return value.toString();
        }
        throw new SyntaxError(`Cannot convert value of attribute ${key} to string`);
    }
}

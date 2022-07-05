import { Xml } from '../utils/xml';

export class CAttributes extends Map<string, string> {
    constructor(attributes: Record<string, unknown> = {}) {
        super();
        this.importRecord(attributes);
    }

    public override get(name: string): string {
        const value = super.get(name);

        if (value === undefined) {
            return '';
        }

        return value;
    }

    public override set(name: string, value: string | null | undefined = null): this {
        if (value === null || value === undefined) {
            this.delete(name);

            return this;
        }
        if (!Xml.isValidXmlName(name)) {
            throw new SyntaxError(`Cannot set attribute with an invalid xml name: ${name}`);
        }
        super.set(name, value.toString());

        return this;
    }

    public exists(name: string): boolean {
        let found = false;
        for (const key of this.keys()) {
            if (name === key) {
                found = true;
                break;
            }
        }

        return found;
    }

    public importRecord(attributes: Record<string, unknown>): this {
        if (attributes != {}) {
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
     * @param key - key
     * @param value - value
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

    /**
     * Array access implementation as attribute helpers
     */
    public offsetExists(offset: string): boolean {
        return this.exists(offset);
    }

    public offsetGet(offset: string): string {
        return this.get(offset);
    }

    public offsetSet(offset: string, value: unknown): void {
        this.set(offset, CAttributes.castValueToString(offset, value));
    }

    public offsetUnset(offset: string): void {
        super.delete(offset);
    }
}

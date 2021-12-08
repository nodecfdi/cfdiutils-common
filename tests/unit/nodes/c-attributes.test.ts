import { CAttributes } from '../../../src';

describe('Nodes.CAttributes', () => {
    test('construct without arguments', () => {
        const attributes = new CAttributes();
        expect(attributes.size).toBe(0);
    });

    test('construct with members', () => {
        const data = {
            id: 'sample',
            foo: 'bar'
        };
        const attributes = new CAttributes(data);
        expect(attributes.size).toBe(2);
        attributes.forEach((value, key) => {
            expect(attributes.has(key)).toBeTruthy();
            expect(attributes.get(key)).toEqual(value);
        });
    });

    test.each([
        ['empty', ''],
        ['white space', '    ']
    ])('set method with invalid name %s', (opt, name) => {
        const attributes = new CAttributes();
        expect.assertions(1);
        try {
            attributes.set(name, '');
        } catch (e) {
            expect(e).toBeInstanceOf(SyntaxError);
        }
    });

    test('set method', () => {
        const attributes = new CAttributes();
        // first
        attributes.set('foo', 'bar');
        expect(attributes.size).toBe(1);
        expect(attributes.get('foo')).toBe('bar');
        // second
        attributes.set('lorem', 'ipsum');
        expect(attributes.size).toBe(2);
        expect(attributes.get('lorem')).toBe('ipsum');
        // override
        attributes.set('foo', 'BAR');
        expect(attributes.size).toBe(2);
        expect(attributes.get('foo')).toBe('BAR');
    });

    test.each([
        ['empty', ''],
        ['white space', ' '],
        ['digit', '0'],
        ['digit hyphen text', '0-foo'],
        ['hyphen', '-'],
        ['hyphen text', '-x'],
        ['inner space', 'foo bar']
    ])('set with invalid names (%s)', (opt, name) => {
        const attributes = new CAttributes();
        expect(() => attributes.set(name, '')).toThrow('invalid xml name');
    });

    test('get method on non existent', () => {
        const attributes = new CAttributes();
        expect(attributes.get('foo')).toBe('');
    });

    test('remove', () => {
        const attributes = new CAttributes();
        attributes.set('foo', 'bar');

        attributes.delete('bar');
        expect(attributes.size).toBe(1);

        attributes.delete('foo');
        expect(attributes.size).toBe(0);
    });

    test('iterator', () => {
        const data = {
            foo: 'bar',
            lorem: 'ipsum'
        };
        const created: Record<string, string> = {};
        const attributes = new CAttributes(data);
        attributes.forEach((value, key) => {
            created[key] = value;
        });
        expect(created).toStrictEqual(data);
    });

    test('set to (undefined|null) perform remove', () => {
        const attributes = new CAttributes({
            foo: 'bar',
            bar: 'foo'
        });
        expect(attributes.has('foo')).toBeTruthy();
        expect(attributes.has('bar')).toBeTruthy();
        attributes.set('foo', undefined);
        expect(attributes.has('foo')).toBeFalsy();
        attributes.set('bar', null);
        expect(attributes.has('bar')).toBeFalsy();
    });

    test('import with (undefined|null) perform remove', () => {
        const attributes = new CAttributes({
            set: '1',
            importArray: '1',
            offsetSet: '1',
            constructor: undefined,
            empty: null
        });
        expect(attributes.size).toBe(3);
        expect(attributes.has('constructor')).toBeFalsy();
        expect(attributes.has('empty')).toBeFalsy();
        expect(attributes.size).toBe(3);

        attributes.set('set', undefined);
        expect(attributes.has('set')).toBeFalsy();
        expect(attributes.size).toBe(2);

        attributes.importRecord({ importArray: undefined });
        expect(attributes.has('importArray')).toBeFalsy();
        expect(attributes.size).toBe(1);

        attributes.set('offsetSet', null);
        expect(attributes.has('offsetSet')).toBeFalsy();
        expect(attributes.size).toBe(0);
    });

    test('import with invalid value', () => {
        expect(
            () =>
                new CAttributes({
                    foo: []
                })
        ).toThrow('Cannot convert value of attribute foo to string');
    });

    test('set with object to string', () => {
        const expectedValue = 'foo';

        function Foo(this: { value: string }, value: string) {
            this.value = value;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const toStringObject = new Foo('foo');

        Foo.prototype.toString = function() {
            return this.value;
        };

        const attributes = new CAttributes({
            constructor: toStringObject
        });

        attributes.set('offsetSet', toStringObject);
        attributes.set('set', toStringObject);
        attributes.importRecord({
            importArray: toStringObject
        });
        expect(attributes.get('constructor')).toBe(expectedValue);
        expect(attributes.get('offsetSet')).toBe(expectedValue);
        expect(attributes.get('set')).toBe(expectedValue);
        expect(attributes.get('importArray')).toBe(expectedValue);
    });

    test('export record', () => {
        const attributes = new CAttributes();
        attributes.set('foo', 'bar');

        expect(attributes.exportRecord()).toStrictEqual({
            foo: 'bar'
        });
    });
});

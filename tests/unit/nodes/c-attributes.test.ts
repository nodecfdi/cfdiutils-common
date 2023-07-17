import { CAttributes } from 'src/nodes/c-attributes';

describe('nodes_cattributes', () => {
    test('construct_without_arguments', () => {
        const attributes = new CAttributes();
        expect(attributes.size).toBe(0);
    });

    test('construct_with_members', () => {
        const data = {
            id: 'sample',
            foo: 'bar',
        };
        const attributes = new CAttributes(data);
        expect(attributes.size).toBe(2);
        for (const [key, value] of attributes.entries()) {
            expect(attributes.exists(key)).toBeTruthy();
            expect(attributes.get(key)).toEqual(value);
        }
    });

    test.each([
        ['empty', ''],
        ['white_spaces', '    '],
    ])('set_method_with_invalid_name_%s', (_name, attribute) => {
        const attributes = new CAttributes();
        const t = (): void => {
            attributes.set(attribute, '');
        };

        expect(t).toThrow(SyntaxError);
    });

    test('set_method', () => {
        const attributes = new CAttributes();
        // First
        attributes.set('foo', 'bar');
        expect(attributes.size).toBe(1);
        expect(attributes.get('foo')).toBe('bar');
        // Second
        attributes.set('lorem', 'ipsum');
        expect(attributes.size).toBe(2);
        expect(attributes.get('lorem')).toBe('ipsum');
        // Override
        attributes.set('foo', 'BAR');
        expect(attributes.size).toBe(2);
        expect(attributes.get('foo')).toBe('BAR');
    });

    test.each([
        ['empty', ''],
        ['white_space', ' '],
        ['digit', '0'],
        ['digit_hyphen_text', '0-foo'],
        ['hyphen', '-'],
        ['hyphen_text', '-x'],
        ['inner_space', 'foo bar'],
    ])('set_with_invalid_names_%s', (_name, attribute) => {
        const attributes = new CAttributes();
        expect(() => attributes.set(attribute, '')).toThrow('invalid xml name');
    });

    test('get_method_on_non_existent', () => {
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

    test('map_access', () => {
        const attributes = new CAttributes();
        attributes.offsetSet('id', 'sample');
        attributes.offsetSet('foo', 'foo foo foo');
        attributes.offsetSet('foo', 'bar'); // Override
        attributes.offsetSet('empty', '');
        expect(attributes.size).toBe(3);

        // Existent
        expect(attributes.offsetExists('empty')).toBeTruthy();
        expect(attributes.offsetExists('id')).toBeTruthy();
        expect(attributes.offsetGet('id')).toBe('sample');
        expect(attributes.offsetGet('foo')).toBe('bar');
        // Non existent
        expect(attributes.offsetExists('non-existent')).toBeFalsy();
        expect(attributes.offsetGet('non-existent')).toBe('');
        // Remove and check
        attributes.offsetUnset('foo');
        expect(attributes.offsetGet('foo')).toBe('');
    });

    test('iterator', () => {
        const data = {
            foo: 'bar',
            lorem: 'ipsum',
        };
        const created: Record<string, string> = {};
        const attributes = new CAttributes(data);
        for (const [key, value] of attributes.entries()) {
            created[key] = value;
        }

        expect(created).toStrictEqual(data);
    });

    test('set_to_(undefined|null)_perform remove', () => {
        const attributes = new CAttributes({
            foo: 'bar',
            bar: 'foo',
        });
        expect(attributes.exists('foo')).toBeTruthy();
        expect(attributes.exists('bar')).toBeTruthy();
        attributes.offsetSet('foo');
        expect(attributes.exists('foo')).toBeFalsy();
        attributes.offsetSet('bar');
        expect(attributes.exists('bar')).toBeFalsy();
    });

    test('import_with_empty', () => {
        const attributes = new CAttributes({
            foo: 'bar',
            bar: 'foo',
        });
        expect(attributes.size).toBe(2);

        attributes.importRecord({});
        expect(attributes.size).toBe(2);

        attributes.importRecord({ another: 'another' });
        expect(attributes.size).toBe(3);
    });

    test('import_with_(undefined|null)_perform_remove', () => {
        const attributes = new CAttributes({
            set: '1',
            importArray: '1',
            offsetSet: '1',
            constructor: undefined,
            empty: null,
        });
        expect(attributes.size).toBe(3);
        expect(attributes.exists('constructor')).toBeFalsy();
        expect(attributes.exists('empty')).toBeFalsy();
        expect(attributes.size).toBe(3);

        attributes.set('set', undefined);
        expect(attributes.exists('set')).toBeFalsy();
        expect(attributes.size).toBe(2);

        attributes.importRecord({ importArray: undefined });
        expect(attributes.exists('importArray')).toBeFalsy();
        expect(attributes.size).toBe(1);

        attributes.offsetSet('offsetSet', null);
        expect(attributes.exists('offsetSet')).toBeFalsy();
        expect(attributes.size).toBe(0);
    });

    test('import_with_invalid value', () => {
        expect(
            () =>
                new CAttributes({
                    foo: [],
                }),
        ).toThrow('Cannot convert value of attribute foo to string');
    });

    test('set_with_object_to_string', () => {
        const expectedValue = 'foo';

        function Foo(this: { value: string }, value: string): void {
            this.value = value;
        }

        const toStringObject: string = new (Foo as unknown as new (value: string) => string)('foo');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        Foo.prototype.toString = function (): string {
            return (this as { value: string }).value;
        };

        const attributes = new CAttributes({
            constructor: toStringObject,
        });

        attributes.set('offsetSet', toStringObject);
        attributes.set('set', toStringObject);
        attributes.importRecord({
            importArray: toStringObject,
        });

        expect(attributes.get('constructor')).toBe(expectedValue);
        expect(attributes.get('offsetSet')).toBe(expectedValue);
        expect(attributes.get('set')).toBe(expectedValue);
        expect(attributes.get('importArray')).toBe(expectedValue);
    });

    test('export_record', () => {
        const attributes = new CAttributes();
        attributes.set('foo', 'bar');

        expect(attributes.exportRecord()).toStrictEqual({
            foo: 'bar',
        });
    });
});

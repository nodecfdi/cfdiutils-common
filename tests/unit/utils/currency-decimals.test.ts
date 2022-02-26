import { CurrencyDecimals } from '../../../src/utils/currency-decimals';

describe('CurrencyDecimals', () => {
    test('create generic', () => {
        const curDec = new CurrencyDecimals('FOO', 2);

        expect(curDec.currency()).toBe('FOO');
        expect(curDec.decimals()).toBe(2);
    });

    test.each([[''], ['ÑÑÑ'], ['XXXX']])('create with empty code', (currency) => {
        expect.hasAssertions();
        try {
            new CurrencyDecimals(currency, 2);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toContain('currency');
        }
    });

    test('create with negative decimals', () => {
        expect.hasAssertions();
        try {
            new CurrencyDecimals('FOO', -1);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toContain('decimals');
        }
    });

    test('does not exceed', () => {
        const foo = new CurrencyDecimals('FOO', 3);
        expect(foo.doesNotExceedDecimals('1')).toBeTruthy();
        expect(foo.doesNotExceedDecimals('1.000')).toBeTruthy();
        expect(foo.doesNotExceedDecimals('1.999')).toBeTruthy();
        expect(foo.doesNotExceedDecimals('1.0001')).toBeFalsy();
        expect(foo.doesNotExceedDecimals('1.0000')).toBeFalsy();
    });

    test('decimals count', () => {
        expect(CurrencyDecimals.decimalsCount('1')).toBe(0);
        expect(CurrencyDecimals.decimalsCount('1.')).toBe(0);
        expect(CurrencyDecimals.decimalsCount('1.0')).toBe(1);
        expect(CurrencyDecimals.decimalsCount('1.00')).toBe(2);
    });

    test('known currency mexican peso', () => {
        const mxn = CurrencyDecimals.newFromKnownCurrencies('MXN');
        expect(mxn.currency()).toBe('MXN');
        expect(mxn.decimals()).toBe(2);
    });

    test('unknown currency', () => {
        expect.hasAssertions();
        try {
            CurrencyDecimals.newFromKnownCurrencies('FOO');
        } catch (e) {
            expect(e).toBeInstanceOf(RangeError);
            expect((e as RangeError).message).toContain('not known');
        }
    });

    test('unknown currency with decimals', () => {
        const foo = CurrencyDecimals.newFromKnownCurrencies('FOO', 6);

        expect(foo.currency()).toBe('FOO');
        expect(foo.decimals()).toBe(6);
    });

    test('known decimals mexican peso', () => {
        expect(CurrencyDecimals.knownCurrencyDecimals('MXN')).toBe(2);
    });
});

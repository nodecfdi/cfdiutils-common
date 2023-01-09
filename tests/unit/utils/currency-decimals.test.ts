import { CurrencyDecimals } from '~/utils/currency-decimals';

describe('CurrencyDecimals', () => {
    test('create generic', () => {
        const currentDec = new CurrencyDecimals('FOO', 2);

        expect(currentDec.currency()).toBe('FOO');
        expect(currentDec.decimals()).toBe(2);
    });

    test.each([[''], ['ÑÑÑ'], ['XXXX']])('create with empty code', (currency) => {
        const t = (): CurrencyDecimals => new CurrencyDecimals(currency, 2);

        expect(t).toThrow(Error);
        expect(t).toThrow('currency');
    });

    test('create with negative decimals', () => {
        const t = (): CurrencyDecimals => new CurrencyDecimals('FOO', -1);

        expect(t).toThrow(Error);
        expect(t).toThrow('decimals');
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
        const t = (): void => {
            CurrencyDecimals.newFromKnownCurrencies('FOO');
        };

        expect(t).toThrow(RangeError);
        expect(t).toThrow('not known');
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

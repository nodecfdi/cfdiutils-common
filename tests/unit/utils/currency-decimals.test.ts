import { CurrencyDecimals } from 'src/utils/currency-decimals';

describe('currency_decimals', () => {
  test('create_generic', () => {
    const currentDec = new CurrencyDecimals('FOO', 2);

    expect(currentDec.currency()).toBe('FOO');
    expect(currentDec.decimals()).toBe(2);
  });

  test.each([[''], ['ÑÑÑ'], ['XXXX']])('create_with_empty_code_%s', (currency) => {
    const t = (): CurrencyDecimals => new CurrencyDecimals(currency, 2);

    expect(t).toThrow(Error);
    expect(t).toThrow('currency');
  });

  test('create_with_negative_decimals', () => {
    const t = (): CurrencyDecimals => new CurrencyDecimals('FOO', -1);

    expect(t).toThrow(Error);
    expect(t).toThrow('decimals');
  });

  test('does_not_exceed', () => {
    const foo = new CurrencyDecimals('FOO', 3);
    expect(foo.doesNotExceedDecimals('1')).toBeTruthy();
    expect(foo.doesNotExceedDecimals('1.000')).toBeTruthy();
    expect(foo.doesNotExceedDecimals('1.999')).toBeTruthy();
    expect(foo.doesNotExceedDecimals('1.0001')).toBeFalsy();
    expect(foo.doesNotExceedDecimals('1.0000')).toBeFalsy();
  });

  test('decimals_count', () => {
    expect(CurrencyDecimals.decimalsCount('1')).toBe(0);
    expect(CurrencyDecimals.decimalsCount('1.')).toBe(0);
    expect(CurrencyDecimals.decimalsCount('1.0')).toBe(1);
    expect(CurrencyDecimals.decimalsCount('1.00')).toBe(2);
  });

  test('known_currency_mexican_peso', () => {
    const mxn = CurrencyDecimals.newFromKnownCurrencies('MXN');
    expect(mxn.currency()).toBe('MXN');
    expect(mxn.decimals()).toBe(2);
  });

  test('unknown_currency', () => {
    const t = (): void => {
      CurrencyDecimals.newFromKnownCurrencies('FOO');
    };

    expect(t).toThrow(RangeError);
    expect(t).toThrow('not known');
  });

  test('unknown_currency_with_decimals', () => {
    const foo = CurrencyDecimals.newFromKnownCurrencies('FOO', 6);

    expect(foo.currency()).toBe('FOO');
    expect(foo.decimals()).toBe(6);
  });

  test('known_decimals_mexican_peso', () => {
    expect(CurrencyDecimals.knownCurrencyDecimals('MXN')).toBe(2);
  });

  test('round', () => {
    const mxn = CurrencyDecimals.newFromKnownCurrencies('MXN');

    expect(mxn.round(45_740.349)).toBe(45_740.35);
    expect(mxn.round(1.234)).toBe(1.23);
    expect(mxn.round(1.235)).toBe(1.24);
    expect(mxn.round(1.236)).toBe(1.24);
  });
});

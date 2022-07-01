export class CurrencyDecimals {
    private readonly _currency: string;

    private readonly _decimals: number;

    constructor(currency: string, decimals: number) {
        if (!currency.match(/^[A-Z]{3}$/)) {
            throw new Error('Property currency is not valid');
        }
        if (decimals < 0) {
            throw new Error('Property decimals cannot be less than zero');
        }
        this._currency = currency;
        this._decimals = Math.floor(decimals);
    }

    public currency(): string {
        return this._currency;
    }

    public decimals(): number {
        return this._decimals;
    }

    public round(value: number): number {
        return Number.parseFloat(value.toFixed(this.decimals()));
    }

    public doesNotExceedDecimals(value: string): boolean {
        return CurrencyDecimals.decimalsCount(value) <= this.decimals();
    }

    public static decimalsCount(value: string): number {
        const values = value.split('.');

        return values.length > 1 ? values[values.length - 1].length : 0;
    }

    public static newFromKnownCurrencies(currency: string, defaultVal: number | null = null): CurrencyDecimals {
        let decimals = CurrencyDecimals.knownCurrencyDecimals(currency);
        if (decimals < 0) {
            if (!defaultVal) {
                throw new RangeError(`The currency ${currency} is not known`);
            }
            decimals = defaultVal;
        }

        return new CurrencyDecimals(currency, decimals);
    }

    public static knownCurrencyDecimals(currency: string): number {
        const map: Record<string, number> = {
            MXN: 2,
            EUR: 2,
            USD: 2,
            XXX: 0
        };

        return map[currency] || -1;
    }
}

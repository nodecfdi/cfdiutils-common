/**
 * @public
 */
export type CNodeHasValueInterface = {
    value(): string;

    setValue(value: string): void;
};

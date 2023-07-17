import { type CNodeInterface } from './c-node-interface';

export class CNodesSorter {
    private _order: Map<string, number> = new Map<string, number>();

    private size!: number;

    constructor(order: string[] = []) {
        this.setOrder(order);
    }

    /**
     * Internal compare Maps
     * @param a - map
     * @param b - map
     */
    private static compareMaps(a: Map<unknown, unknown>, b: Map<unknown, unknown>): boolean {
        let testValue;
        if (a.size !== b.size) {
            return false;
        }

        for (const [key, value] of a) {
            testValue = b.get(key);
            if (testValue !== value || (testValue === undefined && !b.has(key))) {
                return false;
            }
        }

        return true;
    }

    /**
     * It takes only the unique strings names and sort using the order of appearance
     * @param names - unique strings
     */
    public setOrder(names: string[]): boolean {
        const order = new Map(Array.from(this.parseNames(names), (entry) => [entry[1], entry[0]]));
        if (CNodesSorter.compareMaps(this._order, order)) {
            return false;
        }

        this._order = order;
        this.size = order.size;

        return true;
    }

    public parseNames(names: unknown[]): Map<number, string> {
        const isValidName = (name: unknown): boolean => Boolean(name) && typeof name === 'string' && name !== '0';

        return new Map(
            [...new Set(names.filter((element) => isValidName(element)) as string[])].map((entry, index) => [
                index,
                entry,
            ]),
        );
    }

    /**
     * The current order list
     */
    public getOrder(): string[] {
        const flippedArray = new Map(Array.from(this._order, (entry) => [entry[1], entry[0]]));

        return [...flippedArray.values()];
    }

    public sort(nodes: CNodeInterface[]): CNodeInterface[] {
        if (this.size > 0) {
            nodes = this.stableArraySort(nodes, 'compareNodesByName');
        }

        return nodes;
    }

    public compareNodesByName(a: CNodeInterface, b: CNodeInterface): number {
        const aNumber = this.valueByName(a.name());
        const bNumber = this.valueByName(b.name());

        return Math.sign(aNumber - bNumber);
    }

    public valueByName(name: string): number {
        const getOrder = this._order.get(name);

        return getOrder ?? this.size;
    }

    /**
     * This function is a replacement for sort that try to sort
     * but if items are equal then uses the relative position as second argument
     * @param input - CNodeInterface
     * @param callable - function callable
     */
    private stableArraySort(input: CNodeInterface[], callable: keyof this): CNodeInterface[] {
        let list = input.map((entry, index) => ({
            item: entry,
            index,
        }));

        // Double check by function provider and indexed
        const comparar = (
            a: { item: CNodeInterface; index: number },
            b: { item: CNodeInterface; index: number },
        ): number => {
            let value: number = (this[callable] as (a: CNodeInterface, b: CNodeInterface) => number)(a.item, b.item);
            if (value === 0) {
                value = Math.sign(a.index - b.index);
            }

            return value;
        };

        list = list.sort(comparar);

        return list.map((node) => node.item);
    }
}

import { CNodeInterface } from './c-node-interface';

export class CNodesSorter {
    private _order: Map<string, number> = new Map<string, number>();
    private size!: number;

    constructor(order: string[] = []) {
        this.setOrder(order);
    }

    /**
     * It takes only the unique strings names and sort using the order of appearance
     * @param names
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
        const isValidName = (name: unknown): boolean => {
            return !!name && typeof name === 'string' && name !== '0';
        };
        return new Map(
            [...new Set(names.filter(isValidName) as string[])].map((entry, i) => {
                return [i, entry];
            })
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
        return getOrder !== undefined ? getOrder : this.size;
    }

    /**
     * This function is a replacement for sort that try to sort
     * but if items are equal then uses the relative position as second argument
     * @param input
     * @param callable
     * @private
     */
    private stableArraySort(input: CNodeInterface[], callable: string): CNodeInterface[] {
        let list = input.map((entry, i) => {
            return {
                item: entry,
                index: i,
            };
        });

        // Double check by function provider and indexed
        const comparar = (
            a: { item: CNodeInterface; index: number },
            b: { item: CNodeInterface; index: number }
        ): number => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            let value: number = this[callable](a.item, b.item) as number;
            if (value === 0) {
                value = Math.sign(a.index - b.index);
            }
            return value;
        };

        list = list.sort(comparar);
        return list.map((node) => {
            return node.item;
        });
    }

    /**
     * Internal compare Maps
     * @param a
     * @param b
     * @private
     */
    private static compareMaps(a: Map<unknown, unknown>, b: Map<unknown, unknown>): boolean {
        let testVal;
        if (a.size !== b.size) {
            return false;
        }
        for (const [key, val] of a) {
            testVal = b.get(key);
            if (testVal !== val || (testVal === undefined && !b.has(key))) {
                return false;
            }
        }
        return true;
    }
}

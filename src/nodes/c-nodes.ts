import { CNodeInterface } from './c-node-interface';
import { CNodesSorter } from './c-nodes-sorter';

export class CNodes extends Array<CNodeInterface> {
    private _sorter: CNodesSorter;

    constructor(nodes: CNodeInterface[] = []) {
        super();
        this._sorter = new CNodesSorter();
        this.importFromArray(nodes);
    }

    public add(...nodes: CNodeInterface[]): this {
        let somethingChange = false;
        nodes.forEach((node) => {
            if (!this.exists(node)) {
                this.push(node);
                somethingChange = true;
            }
        });
        if (somethingChange) {
            this.order();
        }
        return this;
    }

    public order() {
        this.splice(0, this.length, ...this._sorter.sort(this));
    }

    /**
     * It takes only the unique string names and sort using the order of appearance
     * @param names
     */
    public setOrder(names: string[]) {
        if (this._sorter.setOrder(names)) {
            this.order();
        }
    }

    public getOrder(): string[] {
        return this._sorter.getOrder();
    }

    public remove(node: CNodeInterface): this {
        const index = this.indexOf(node);
        if (index >= 0) {
            this.splice(index, 1);
        }
        return this;
    }

    public removeAll(): this {
        this.splice(0, this.length);
        return this;
    }

    public exists(node: CNodeInterface): boolean {
        return this.indexOf(node) >= 0;
    }

    public first(): CNodeInterface | undefined {
        return this.find((x) => x !== undefined);
    }

    public get(position: number): CNodeInterface {
        const indexedNodes = [...this.values()];
        const value = indexedNodes[position];
        if (!value) {
            throw new RangeError(`The index ${position} does not exists`);
        }
        return value;
    }

    public firstNodeWithName(nodeName: string): CNodeInterface | undefined {
        return this.find((node) => node.name() === nodeName);
    }

    public getNodesByName(nodeName: string): CNodes {
        const nodes = new CNodes();
        this.forEach((node) => {
            if (node.name() === nodeName) {
                nodes.add(node);
            }
        });
        return nodes;
    }

    public importFromArray(nodes: CNodeInterface[]): CNodes {
        nodes.forEach((node, i) => {
            if (typeof node.searchNodes !== 'function' || typeof node.children !== 'function') {
                throw new SyntaxError(`The element index ${i} is not a CNodeInterface object`);
            }
        });
        this.add(...nodes);
        return this;
    }

    static get [Symbol.species]() {
        return Array;
    }
}

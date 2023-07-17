import { Xml } from '../utils/xml';
import { CAttributes } from './c-attributes';
import { type CNodeHasValueInterface } from './c-node-has-value-interface';
import { type CNodeInterface } from './c-node-interface';
import { CNodes } from './c-nodes';

export class CNode implements CNodeInterface, CNodeHasValueInterface {
    private readonly _name: string;

    private readonly _attributes: CAttributes;

    private readonly _children: CNodes;

    private _value: string;

    constructor(name: string, attributes: Record<string, unknown> = {}, children: CNodeInterface[] = [], value = '') {
        if (!Xml.isValidXmlName(name)) {
            throw new SyntaxError(`Cannot create a node with an invalid xml name: ${name}`);
        }

        this._name = name;
        this._attributes = new CAttributes(attributes);
        this._children = new CNodes(children);
        this._value = value;
    }

    public name(): string {
        return this._name;
    }

    public children(): CNodes {
        return this._children;
    }

    public addChild(node: CNodeInterface): CNodeInterface {
        this._children.add(node);

        return node;
    }

    public attributes(): CAttributes {
        return this._attributes;
    }

    public clear(): void {
        this._attributes.clear();
        this._children.removeAll();
    }

    public addAttributes(attributes: Record<string, unknown>): void {
        this._attributes.importRecord(attributes);
    }

    public value(): string {
        return this._value;
    }

    public setValue(value: string): void {
        this._value = value;
    }

    public searchAttribute(...searchPath: string[]): string {
        const attribute = searchPath.pop();
        const node = this.searchNode(...searchPath);
        if (!node || !attribute) {
            return '';
        }

        return node.attributes().get(attribute) || '';
    }

    public searchNodes(...searchPath: string[]): CNodes {
        const nodes = new CNodes();
        const nodeName = searchPath.pop();
        const parent = this.searchNode(...searchPath);
        if (parent) {
            for (const child of parent.children()) {
                if (child.name() === nodeName) {
                    nodes.add(child);
                }
            }
        }

        return nodes;
    }

    public searchNode(...searchPath: string[]): CNodeInterface | undefined {
        // eslint-disable-next-line @typescript-eslint/no-this-alias, unicorn/no-this-assignment
        let node: CNodeInterface | undefined = this;
        for (const searchName of searchPath) {
            node = node.children().firstNodeWithName(searchName);
            if (!node) {
                break;
            }
        }

        return node;
    }

    /**
     * Array access implementation as attribute helpers
     */
    public offsetExists(offset: string): boolean {
        return this.attributes().offsetExists(offset);
    }

    public get(offset: string): string {
        return this.attributes().offsetGet(offset);
    }

    public set(offset: string, value: unknown): void {
        this.attributes().offsetSet(offset, value);
    }

    public unset(offset: string): void {
        this.attributes().offsetUnset(offset);
    }

    public count(): number {
        return this.children().length;
    }

    public [Symbol.iterator](): IterableIterator<CNodeInterface> {
        return this._children[Symbol.iterator]();
    }
}

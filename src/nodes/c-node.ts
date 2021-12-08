import { CNodeInterface } from './c-node-interface';
import { CAttributes } from './c-attributes';
import { Xml } from '../utils/xml';
import { CNodes } from './c-nodes';

export class CNode implements CNodeInterface {
    private readonly _name: string;
    private readonly _attributes: CAttributes;
    private readonly _children: CNodes;

    constructor(name: string, attributes: Record<string, unknown> = {}, children: CNodeInterface[] = []) {
        if (!Xml.isValidXmlName(name)) {
            throw new SyntaxError(`Cannot create a node with an invalid xml name: ${name}`);
        }
        this._name = name;
        this._attributes = new CAttributes(attributes);
        this._children = new CNodes(children);
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

    public clear() {
        this._attributes.clear();
        this._children.removeAll();
    }

    public addAttributes(attributes: Record<string, unknown>) {
        this._attributes.importRecord(attributes);
    }

    public searchAttribute(...searchPath: string[]): string {
        const attribute = searchPath.pop();
        const node = this.searchNode(...searchPath);
        if (!node || !attribute) return '';
        return node.attributes().get(attribute) || '';
    }

    public searchNodes(...searchPath: string[]): CNodes {
        const nodes = new CNodes();
        const nodeName = searchPath.pop();
        const parent = this.searchNode(...searchPath);
        if (parent) {
            parent.children().forEach((child) => {
                if (child.name() === nodeName) {
                    nodes.add(child);
                }
            });
        }
        return nodes;
    }

    public searchNode(...searchPath: string[]): CNodeInterface | undefined {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let node: CNodeInterface | undefined = this;
        for (const searchName of searchPath) {
            node = node.children().firstNodeWithName(searchName);
            if (!node) {
                break;
            }
        }
        return node;
    }

    public count() {
        return this.children().length;
    }

    [Symbol.iterator](): IterableIterator<CNodeInterface> {
        return this._children[Symbol.iterator]();
    }
}

import { Xml } from '../utils/xml.js';
import { Attributes } from './attributes.js';
import { type NodeHasValueInterface } from './node-has-value-interface.js';
import { type NodeInterface } from './node-interface.js';
import { Nodes } from './nodes.js';

export class Node implements NodeInterface, NodeHasValueInterface {
  private readonly _name: string;

  private readonly _attributes: Attributes;

  private readonly _children: Nodes;

  private _value: string;

  constructor(name: string, attributes: Record<string, unknown> = {}, children: NodeInterface[] = [], value = '') {
    if (!Xml.isValidXmlName(name)) {
      throw new SyntaxError(`Cannot create a node with an invalid xml name: ${name}`);
    }

    this._name = name;
    this._attributes = new Attributes(attributes);
    this._children = new Nodes(children);
    this._value = value;
  }

  public name(): string {
    return this._name;
  }

  public children(): Nodes {
    return this._children;
  }

  public addChild(node: NodeInterface): NodeInterface {
    this._children.add(node);

    return node;
  }

  public attributes(): Attributes {
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

  public searchNodes(...searchPath: string[]): Nodes {
    const nodes = new Nodes();
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

  public searchNode(...searchPath: string[]): NodeInterface | undefined {
    // eslint-disable-next-line unicorn/no-this-assignment, @typescript-eslint/no-this-alias
    let node: NodeInterface | undefined = this;
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

  public [Symbol.iterator](): IterableIterator<NodeInterface> {
    return this._children[Symbol.iterator]();
  }
}

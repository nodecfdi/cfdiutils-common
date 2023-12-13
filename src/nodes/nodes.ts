import { type NodeInterface } from './node-interface.js';
import { NodesSorter } from './nodes-sorter.js';

export class Nodes extends Array<NodeInterface> {
  private readonly _sorter: NodesSorter;

  constructor(nodes: NodeInterface[] = []) {
    super();
    this._sorter = new NodesSorter();
    this.importFromArray(nodes);
  }

  public static get [Symbol.species](): ArrayConstructor {
    return Array;
  }

  public add(...nodes: NodeInterface[]): this {
    let somethingChange = false;
    for (const node of nodes) {
      if (!this.exists(node)) {
        this.push(node);
        somethingChange = true;
      }
    }

    if (somethingChange) {
      this.order();
    }

    return this;
  }

  public order(): void {
    this.splice(0, this.length, ...this._sorter.sort(this));
  }

  /**
   * It takes only the unique string names and sort using the order of appearance
   * @param names - names for order
   */
  public setOrder(names: string[]): void {
    if (this._sorter.setOrder(names)) {
      this.order();
    }
  }

  public getOrder(): string[] {
    return this._sorter.getOrder();
  }

  public remove(node: NodeInterface): this {
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

  public exists(node: NodeInterface): boolean {
    return this.includes(node);
  }

  public first(): NodeInterface | undefined {
    return this.at(0);
  }

  public get(position: number): NodeInterface {
    const indexedNodes = [...this.values()];
    const value = indexedNodes.at(position);
    if (!value) {
      throw new RangeError(`The index ${position} does not exists`);
    }

    return value;
  }

  public firstNodeWithName(nodeName: string): NodeInterface | undefined {
    return this.find((node) => node.name() === nodeName);
  }

  public getNodesByName(nodeName: string): Nodes {
    const nodes = new Nodes();
    for (const node of this) {
      if (node.name() === nodeName) {
        nodes.add(node);
      }
    }

    return nodes;
  }

  public importFromArray(nodes: NodeInterface[]): this {
    for (const [index, node] of nodes.entries()) {
      if (typeof node.searchNodes !== 'function' || typeof node.children !== 'function') {
        throw new SyntaxError(`The element index ${index} is not a NodeInterface object`);
      }
    }

    this.add(...nodes);

    return this;
  }
}

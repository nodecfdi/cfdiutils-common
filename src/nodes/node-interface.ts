import { type Attributes } from './attributes.js';
import { type Nodes } from './nodes.js';

export type NodeInterface = {
  name(): string;

  children(): Nodes;

  addChild(node: NodeInterface): NodeInterface;

  attributes(): Attributes;

  addAttributes(attributes: Record<string, unknown>): void;

  clear(): void;

  searchAttribute(...searchPath: string[]): string;

  searchNodes(...searchPath: string[]): Nodes;

  searchNode(...searchPath: string[]): NodeInterface | undefined;

  offsetExists(offset: string): boolean;

  get(offset: string): string;

  set(offset: string, value: string): void;

  unset(offset: string): void;

  count(): number;

  [Symbol.iterator](): IterableIterator<NodeInterface>;
};

import { type CAttributes } from './c-attributes';
import { type CNodes } from './c-nodes';

export type CNodeInterface = {
    name(): string;

    children(): CNodes;

    addChild(node: CNodeInterface): CNodeInterface;

    attributes(): CAttributes;

    addAttributes(attributes: Record<string, unknown>): void;

    clear(): void;

    searchAttribute(...searchPath: string[]): string;

    searchNodes(...searchPath: string[]): CNodes;

    searchNode(...searchPath: string[]): CNodeInterface | undefined;

    offsetExists(offset: string): boolean;

    get(offset: string): string;

    set(offset: string, value: string): void;

    unset(offset: string): void;

    count(): number;

    [Symbol.iterator](): IterableIterator<CNodeInterface>;
};

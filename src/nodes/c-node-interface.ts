import { CAttributes } from './c-attributes';
import { CNodes } from './c-nodes';

export interface CNodeInterface {
    name(): string;

    children(): CNodes;

    addChild(node: CNodeInterface): CNodeInterface;

    attributes(): CAttributes;

    addAttributes(attributes: Record<string, unknown>): void;

    clear(): void;

    searchAttribute(...searchPath: string[]): string;

    searchNodes(...searchPath: string[]): CNodes;

    searchNode(...searchPath: string[]): CNodeInterface | undefined;
}

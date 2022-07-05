import { CNode } from '~/index';

describe('Nodes.CNode', () => {
    test('construct without arguments', () => {
        const node = new CNode('name');
        expect(node.name()).toBe('name');
        expect(node.count()).toBe(0);
        expect(node.children()).toHaveLength(0);
        expect(node.value()).toBe('');
    });

    test('construct with arguments', () => {
        const dummyNode = new CNode('dummy');
        const attributes = {
            foo: 'bar'
        };
        const children = [dummyNode];
        const value = 'xee';
        const node = new CNode('name', attributes, children, value);
        expect(node.attributes().get('foo')).toBe('bar');
        expect(node.children().firstNodeWithName('dummy')).toStrictEqual(dummyNode);
        expect(node.value()).toBe(value);
    });

    test('construct with empty name', () => {
        const t = (): void => {
            new CNode('\n  \t  \n');
        };

        expect(t).toThrow(SyntaxError);
        expect(t).toThrow('invalid xml name');
    });

    test('construct with untrimmed name', () => {
        expect(() => new CNode(' x ')).toThrow('invalid xml name');
    });

    test('search attribute', () => {
        const node = new CNode('root', { level: '1' }, [
            new CNode('child', { level: 2 }, [
                new CNode('grandchild', { level: 3.1 }),
                new CNode('grandchild', { level: 3.2 })
            ])
        ]);

        expect(node.searchAttribute('level')).toBe('1');
        expect(node.searchAttribute('child', 'level')).toBe('2');
        expect(node.searchAttribute('child', 'grandchild', 'level')).toBe('3.1');

        expect(node.searchAttribute('not-found-child', 'child', 'grandchild', 'level')).toBe('');
        expect(node.searchAttribute('not-found-attribute')).toBe('');
    });

    test('search node', () => {
        const grandChildOne = new CNode('grandchild', { level: '3.1' });
        const grandChildTwo = new CNode('grandchild', { level: '3.2' });
        const child = new CNode('child', { level: 2 }, [grandChildOne, grandChildTwo]);
        const root = new CNode('root', { level: 1 }, [child]);

        expect(root.searchNode()).toStrictEqual(root);
        expect(root.searchNode('child')).toStrictEqual(child);
        expect(JSON.stringify(root.searchNode('child', 'grandchild'))).toEqual(JSON.stringify(grandChildOne));

        expect(root.searchNode('child', 'grandchild', 'not-found')).toBeUndefined();
        expect(root.searchNode('not-found', 'child', 'grandchild')).toBeUndefined();
        expect(root.searchNode('not-found')).toBeUndefined();
    });

    test('search nodes', () => {
        const grandChildOne = new CNode('grandchild', { level: '3.1' });
        const grandChildTwo = new CNode('grandchild', { level: '3.2' });
        const child = new CNode('child', { level: 2 }, [grandChildOne, grandChildTwo]);
        const root = new CNode('root', { level: 1 }, [child]);

        const nodesChild = root.searchNodes('child');
        expect(nodesChild).toHaveLength(1);
        expect(nodesChild.first()).toStrictEqual(child);

        const nodesGrandChild = root.searchNodes('child', 'grandchild');
        expect(nodesGrandChild).toHaveLength(2);
        expect(nodesGrandChild.get(0)).toStrictEqual(grandChildOne);
        expect(JSON.stringify(nodesGrandChild.get(1))).toEqual(JSON.stringify(grandChildTwo));

        expect(root.searchNodes('child', 'grandchild', 'not-found')).toHaveLength(0);
        expect(root.searchNodes('not-found', 'child', 'grandchild')).toHaveLength(0);
        expect(root.searchNodes('not-found')).toHaveLength(0);
    });

    test('map access to attributes', () => {
        const node = new CNode('x');
        node.set('id', 'form');

        expect(node.offsetExists('id')).toBeTruthy();
        expect(node.get('id')).toBe('form');

        node.set('id', 'the-form');
        expect(node.get('id')).toBe('the-form');

        node.unset('id');

        expect(node.offsetExists('id')).toBeFalsy();
        expect(node.get('id')).toBe('');
    });

    test('value property', () => {
        const node = new CNode('x');

        node.setValue('first');
        expect(node.value()).toBe('first');

        node.setValue('second');
        expect(node.value()).toBe('second');
    });

    test('add children', () => {
        const node = new CNode('x');
        const childrenNode = new CNode('y');

        node.addChild(childrenNode);

        expect(node.count()).toBe(1);
    });

    test('add attributes', () => {
        const node = new CNode('x');
        expect(node.attributes().size).toBe(0);

        node.addAttributes({ foo: 'foo' });
        expect(node.attributes().size).toBe(1);
    });

    test('clear all', () => {
        const node = new CNode('x', { foo: '1' });
        const childrenNode = new CNode('y');
        node.addChild(childrenNode);

        expect(node.count()).toBe(1);
        expect(node.attributes().size).toBe(1);

        node.clear();
        expect(node.count()).toBe(0);
        expect(node.attributes().size).toBe(0);
    });
});

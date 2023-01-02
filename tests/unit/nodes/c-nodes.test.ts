import { CNode } from '~/nodes/c-node';
import { type CNodeInterface } from '~/nodes/c-node-interface';
import { CNodes } from '~/nodes/c-nodes';

describe('Nodes.CNodes', () => {
    test('empty nodes', () => {
        const nodes = new CNodes();
        expect(nodes).toHaveLength(0);
        expect(nodes.firstNodeWithName('non-existent')).toBeUndefined();
    });

    test('construct with nodes array', () => {
        const expected = [new CNode('foo'), new CNode('bar')];

        const nodes = new CNodes(expected);
        expect(nodes).toHaveLength(2);
        for (const [index, node] of nodes.entries()) {
            expect(node).toStrictEqual(expected[index]);
        }
    });

    test('manipulate the collection', () => {
        const first = new CNode('first');
        const second = new CNode('second');

        const nodes = new CNodes();
        nodes.add(first, second);

        expect(nodes).toHaveLength(2);
        expect(nodes.exists(first)).toBeTruthy();
        expect(nodes.exists(second)).toBeTruthy();

        const equalToFirst = new CNode('foo');
        expect(nodes.exists(equalToFirst)).toBeFalsy();

        // Add an equal node
        nodes.add(equalToFirst);
        expect(nodes).toHaveLength(3);

        // Add an identical node
        nodes.add(equalToFirst);
        expect(nodes).toHaveLength(3);

        // Remove the node
        nodes.remove(equalToFirst);
        expect(nodes).toHaveLength(2);

        // Remove the node again
        nodes.remove(equalToFirst);
        expect(nodes).toHaveLength(2);

        expect(nodes.firstNodeWithName('foo')).toBeUndefined();
        expect(nodes.firstNodeWithName('first')).toStrictEqual(first);
        expect(JSON.stringify(nodes.firstNodeWithName('second'))).toEqual(JSON.stringify(second));
    });

    test('add find remove', () => {
        const root = new CNode('root');
        const nodes = root.children();
        const child = new CNode('child');

        nodes.add(child);
        expect(nodes.exists(child)).toBeTruthy();

        const found = root.searchNode('child');
        expect(found).toStrictEqual(child);

        if (found) {
            nodes.remove(found);
        }

        expect(nodes.exists(child)).toBeFalsy();
    });

    test('first returns null', () => {
        const nodes = new CNodes();
        expect(nodes.first()).toBeUndefined();
    });

    test('import from array', () => {
        const nodeOne = new CNode('one');
        const nodes = new CNodes();
        nodes.importFromArray([nodeOne, new CNode('two'), new CNode('three')]);
        expect(nodes).toHaveLength(3);
        expect(nodes.first()).toStrictEqual(nodeOne);
    });

    test('import from array with non node', () => {
        const nodes = new CNodes();
        expect(() => nodes.importFromArray([String() as unknown as CNodeInterface])).toThrow(
            'The element index 0 is not a CNodeInterface object'
        );
    });

    test('get throws exception when not found', () => {
        const nodes = new CNodes();
        expect(() => nodes.get(0)).toThrow('The index 0 does not exists');
    });

    test('get with existent elements', () => {
        const foo = new CNode('foo');
        const bar = new CNode('bar');
        const nodes = new CNodes([foo, bar]);

        expect(nodes.get(0)).toStrictEqual(foo);
        expect(nodes.get(1)).toStrictEqual(bar);

        // Get after remove
        nodes.remove(foo);
        expect(nodes.get(0)).toStrictEqual(bar);
    });

    test('get nodes by name', () => {
        const nodes = new CNodes();
        const first = new CNode('children');
        const second = new CNode('children');
        const third = new CNode('children');
        nodes.importFromArray([first, second, third, new CNode('other')]);

        expect(nodes).toHaveLength(4);
        const byName = nodes.getNodesByName('children');
        expect(byName).toHaveLength(3);
        expect(byName.exists(first)).toBeTruthy();
        expect(byName.exists(second)).toBeTruthy();
        expect(byName.exists(third)).toBeTruthy();
    });

    test('ordered children', () => {
        const nodes = new CNodes([new CNode('foo'), new CNode('bar'), new CNode('baz')]);
        // Test initial order
        expect(JSON.stringify([nodes.get(0).name(), nodes.get(1).name(), nodes.get(2).name()])).toEqual(
            JSON.stringify(['foo', 'bar', 'baz'])
        );

        // Sort previous values
        nodes.setOrder(['baz', '', '0', 'foo', '', 'bar', 'baz']);
        expect(nodes.getOrder()).toEqual(['baz', 'foo', 'bar']);
        expect(JSON.stringify([nodes.get(0).name(), nodes.get(1).name(), nodes.get(2).name()])).toEqual(
            JSON.stringify(['baz', 'foo', 'bar'])
        );

        // Add other baz (inserted at the bottom)
        nodes.add(new CNode('baz', { id: 'second' }));
        expect(JSON.stringify([nodes.get(0).name(), nodes.get(1).name(), nodes.get(2).name()])).toEqual(
            JSON.stringify(['baz', 'baz', 'foo'])
        );
        expect(nodes.get(1).attributes().get('id')).toEqual('second');

        // Add other not listed
        const notListed = new CNode('yyy');
        nodes.add(notListed);
        expect(nodes.get(4)).toStrictEqual(notListed);
    });
});

import { Node } from 'src/nodes/node';
import { type NodeInterface } from 'src/nodes/node-interface';
import { Nodes } from 'src/nodes/nodes';

describe('nodes_nodes', () => {
  test('empty_nodes', () => {
    const nodes = new Nodes();
    expect(nodes).toHaveLength(0);
    expect(nodes.firstNodeWithName('non-existent')).toBeUndefined();
  });

  test('construct_with_nodes_array', () => {
    const expected = [new Node('foo'), new Node('bar')];

    const nodes = new Nodes(expected);
    expect(nodes).toHaveLength(2);
    for (const [index, node] of nodes.entries()) {
      expect(node).toStrictEqual(expected[index]);
    }
  });

  test('manipulate_the_collection', () => {
    const first = new Node('first');
    const second = new Node('second');

    const nodes = new Nodes();
    nodes.add(first, second);

    expect(nodes).toHaveLength(2);
    expect(nodes.exists(first)).toBeTruthy();
    expect(nodes.exists(second)).toBeTruthy();

    const equalToFirst = new Node('foo');
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

  test('add_find_remove', () => {
    const root = new Node('root');
    const nodes = root.children();
    const child = new Node('child');

    nodes.add(child);
    expect(nodes.exists(child)).toBeTruthy();

    const found = root.searchNode('child');
    expect(found).toStrictEqual(child);

    if (found) {
      nodes.remove(found);
    }

    expect(nodes.exists(child)).toBeFalsy();
  });

  test('first_returns_null', () => {
    const nodes = new Nodes();
    expect(nodes.first()).toBeUndefined();
  });

  test('import_from_array', () => {
    const nodeOne = new Node('one');
    const nodes = new Nodes();
    nodes.importFromArray([nodeOne, new Node('two'), new Node('three')]);
    expect(nodes).toHaveLength(3);
    expect(nodes.first()).toStrictEqual(nodeOne);
  });

  test('import_from_array_with_non_node', () => {
    const nodes = new Nodes();
    expect(() => nodes.importFromArray([String() as unknown as NodeInterface])).toThrow(
      'The element index 0 is not a NodeInterface object',
    );
  });

  test('get_throws_exception_when_not_found', () => {
    const nodes = new Nodes();
    expect(() => nodes.get(0)).toThrow('The index 0 does not exists');
  });

  test('get_with_existent_elements', () => {
    const foo = new Node('foo');
    const bar = new Node('bar');
    const nodes = new Nodes([foo, bar]);

    expect(nodes.get(0)).toStrictEqual(foo);
    expect(nodes.get(1)).toStrictEqual(bar);

    // Get after remove
    nodes.remove(foo);
    expect(nodes.get(0)).toStrictEqual(bar);
  });

  test('get_nodes_by_name', () => {
    const nodes = new Nodes();
    const first = new Node('children');
    const second = new Node('children');
    const third = new Node('children');
    nodes.importFromArray([first, second, third, new Node('other')]);

    expect(nodes).toHaveLength(4);
    const byName = nodes.getNodesByName('children');
    expect(byName).toHaveLength(3);
    expect(byName.exists(first)).toBeTruthy();
    expect(byName.exists(second)).toBeTruthy();
    expect(byName.exists(third)).toBeTruthy();
  });

  test('ordered_children', () => {
    const nodes = new Nodes([new Node('foo'), new Node('bar'), new Node('baz')]);
    // Test initial order
    expect(JSON.stringify([nodes.get(0).name(), nodes.get(1).name(), nodes.get(2).name()])).toEqual(
      JSON.stringify(['foo', 'bar', 'baz']),
    );

    // Sort previous values
    nodes.setOrder(['baz', '', '0', 'foo', '', 'bar', 'baz']);
    expect(nodes.getOrder()).toEqual(['baz', 'foo', 'bar']);
    expect(JSON.stringify([nodes.get(0).name(), nodes.get(1).name(), nodes.get(2).name()])).toEqual(
      JSON.stringify(['baz', 'foo', 'bar']),
    );

    // Add other baz (inserted at the bottom)
    nodes.add(new Node('baz', { id: 'second' }));
    expect(JSON.stringify([nodes.get(0).name(), nodes.get(1).name(), nodes.get(2).name()])).toEqual(
      JSON.stringify(['baz', 'baz', 'foo']),
    );
    expect(nodes.get(1).attributes().get('id')).toEqual('second');

    // Add other not listed
    const notListed = new Node('yyy');
    nodes.add(notListed);
    expect(nodes.get(4)).toStrictEqual(notListed);
  });
});

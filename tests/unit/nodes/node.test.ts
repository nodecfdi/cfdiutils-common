import { Node } from 'src/nodes/node';

describe('nodes_node', () => {
  test('construct_without_arguments', () => {
    const node = new Node('name');
    expect(node.name()).toBe('name');
    expect(node.count()).toBe(0);
    expect(node.children()).toHaveLength(0);
    expect(node.value()).toBe('');
  });

  test('construct_with_arguments', () => {
    const dummyNode = new Node('dummy');
    const attributes = {
      foo: 'bar',
    };
    const children = [dummyNode];
    const value = 'xee';
    const node = new Node('name', attributes, children, value);
    expect(node.attributes().get('foo')).toBe('bar');
    expect(node.children().firstNodeWithName('dummy')).toStrictEqual(dummyNode);
    expect(node.value()).toBe(value);
  });

  test('construct_with_empty_name', () => {
    const t = (): Node => new Node('\n  \t  \n');

    expect(t).toThrow(SyntaxError);
    expect(t).toThrow('invalid xml name');
  });

  test('construct_with_untrimmed_name', () => {
    expect(() => new Node(' x ')).toThrow('invalid xml name');
  });

  test('search_attribute', () => {
    const node = new Node('root', { level: '1' }, [
      new Node('child', { level: 2 }, [new Node('grandchild', { level: 3.1 }), new Node('grandchild', { level: 3.2 })]),
    ]);

    expect(node.searchAttribute('level')).toBe('1');
    expect(node.searchAttribute('child', 'level')).toBe('2');
    expect(node.searchAttribute('child', 'grandchild', 'level')).toBe('3.1');

    expect(node.searchAttribute('not-found-child', 'child', 'grandchild', 'level')).toBe('');
    expect(node.searchAttribute('not-found-attribute')).toBe('');
  });

  test('search_node', () => {
    const grandChildOne = new Node('grandchild', { level: '3.1' });
    const grandChildTwo = new Node('grandchild', { level: '3.2' });
    const child = new Node('child', { level: 2 }, [grandChildOne, grandChildTwo]);
    const root = new Node('root', { level: 1 }, [child]);

    expect(root.searchNode()).toStrictEqual(root);
    expect(root.searchNode('child')).toStrictEqual(child);
    expect(JSON.stringify(root.searchNode('child', 'grandchild'))).toEqual(JSON.stringify(grandChildOne));

    expect(root.searchNode('child', 'grandchild', 'not-found')).toBeUndefined();
    expect(root.searchNode('not-found', 'child', 'grandchild')).toBeUndefined();
    expect(root.searchNode('not-found')).toBeUndefined();
  });

  test('search_nodes', () => {
    const grandChildOne = new Node('grandchild', { level: '3.1' });
    const grandChildTwo = new Node('grandchild', { level: '3.2' });
    const child = new Node('child', { level: 2 }, [grandChildOne, grandChildTwo]);
    const root = new Node('root', { level: 1 }, [child]);

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

  test('map_access_to_attributes', () => {
    const node = new Node('x');
    node.set('id', 'form');

    expect(node.offsetExists('id')).toBeTruthy();
    expect(node.get('id')).toBe('form');

    node.set('id', 'the-form');
    expect(node.get('id')).toBe('the-form');

    node.unset('id');

    expect(node.offsetExists('id')).toBeFalsy();
    expect(node.get('id')).toBe('');
  });

  test('value_property', () => {
    const node = new Node('x');

    node.setValue('first');
    expect(node.value()).toBe('first');

    node.setValue('second');
    expect(node.value()).toBe('second');
  });

  test('add_children', () => {
    const node = new Node('x');
    const childrenNode = new Node('y');

    node.addChild(childrenNode);

    expect(node.count()).toBe(1);
  });

  test('add_attributes', () => {
    const node = new Node('x');
    expect(node.attributes().size).toBe(0);

    node.addAttributes({ foo: 'foo' });
    expect(node.attributes().size).toBe(1);
  });

  test('clear_all', () => {
    const node = new Node('x', { foo: '1' });
    const childrenNode = new Node('y');
    node.addChild(childrenNode);

    expect(node.count()).toBe(1);
    expect(node.attributes().size).toBe(1);

    node.clear();
    expect(node.count()).toBe(0);
    expect(node.attributes().size).toBe(0);
  });
});

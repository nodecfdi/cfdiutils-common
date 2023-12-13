import { Node } from 'src/nodes/node';
import { NodesSorter } from 'src/nodes/nodes-sorter';

describe('nodes_cnodes_sorter', () => {
  test('construct_with_names', () => {
    const values = ['foo', 'bar', 'baz'];
    const sorter = new NodesSorter(values);
    expect(JSON.stringify(sorter.getOrder())).toEqual(JSON.stringify(values));
  });

  test('construct_without_names', () => {
    const sorter = new NodesSorter();
    expect(JSON.stringify(sorter.getOrder())).toEqual(JSON.stringify([]));
  });

  test('parse_names', () => {
    const sorter = new NodesSorter();
    // All invalid values
    expect(sorter.parseNames([null, undefined, 0, ''])).toStrictEqual(new Map());
    // All valid values
    expect(sorter.parseNames(['foo', 'bar'])).toStrictEqual(new Map(['foo', 'bar'].map((value, key) => [key, value])));
    // Duplicated values
    expect(sorter.parseNames(['foo', 'bar', 'bar', 'foo', 'baz'])).toStrictEqual(
      new Map(['foo', 'bar', 'baz'].map((value, key) => [key, value])),
    );
    // Mixed values
    expect(sorter.parseNames(['', 'foo', '', 'bar', 'foo'])).toStrictEqual(
      new Map(['foo', 'bar'].map((value, key) => [key, value])),
    );
  });

  test('set_get_order', () => {
    const sorter = new NodesSorter(['foo', 'bar']);
    expect(JSON.stringify(sorter.getOrder())).toEqual(JSON.stringify(['foo', 'bar']));

    // It changed
    expect(sorter.setOrder(['bar', 'foo'])).toBeTruthy();
    expect(JSON.stringify(sorter.getOrder())).toEqual(JSON.stringify(['bar', 'foo']));

    // It did not change
    expect(sorter.setOrder(['bar', 'foo'])).toBeFalsy();
    expect(JSON.stringify(sorter.getOrder())).toEqual(JSON.stringify(['bar', 'foo']));
  });

  test('order', () => {
    const foo1 = new Node('foo');
    const foo2 = new Node('foo');
    const bar = new Node('bar');
    const baz = new Node('baz');
    const yyy = new Node('yyy');

    const order = ['baz', 'bar', 'foo'];
    const unsorted = [yyy, foo1, foo2, bar, baz];
    const expected = [baz, bar, foo1, foo2, yyy];

    const sorter = new NodesSorter(order);
    const sorted = sorter.sort(unsorted);
    expect(JSON.stringify(sorted)).toEqual(JSON.stringify(expected));
    expect(JSON.stringify(sorted)).not.toEqual(JSON.stringify(unsorted));
  });

  test('order_preserve_position', () => {
    const list: Node[] = [];
    let index = 0;
    while (index < 1000) {
      list.push(new Node('foo'));
      index++;
    }

    const sorter = new NodesSorter(['foo']);
    expect(JSON.stringify(sorter.sort(list))).toEqual(JSON.stringify(list));
  });
});

import { extractTfItems } from '../src/features/tf/extract-native-items';
import { describe, test, expect } from 'vitest';

describe('extractTfItems', () => {
  test('empty field', () => {
    const container = document.createElement('div');
    expect(extractTfItems(container)).toEqual([]);
  });

  test('empty list', () => {
    const container = document.createElement('div');
    container.innerHTML = '<ul></ul>';
    expect(extractTfItems(container)).toEqual([]);
  });

  test('answer mark', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <ul>
        <li>F: foo</li>
        <li>T: bar</li>
        <li><strong>T:  </strong>foo</li>
        <li><strong>T:  f</strong>oo</li>
        <li>bar</li>
      </ul>
`;
    const items = extractTfItems(container);
    expect(items.length).toBe(5);
    expect(items[0].answer).toBe(false);
    expect(items[1].answer).toBe(true);
    expect(items[2].answer).toBe(true);
    expect(items[3].answer).toBe(true);
    expect(items[4].answer).toBe(true);

    expect(items[0].node.outerHTML).toBe('<div>foo</div>');
    expect(items[1].node.outerHTML).toBe('<div>bar</div>');
    expect(items[2].node.outerHTML).toBe('<div><strong></strong>foo</div>');
    expect(items[3].node.outerHTML).toBe('<div><strong>f</strong>oo</div>');
    expect(items[4].node.outerHTML).toBe('<div>[T/F not found] bar</div>');
  });
});

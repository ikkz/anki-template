import { domToMd } from '../src/features/markdown/dom-to-md';
import { describe, test, expect } from 'vitest';

describe('md', () => {
  test('dom-to-md', () => {
    const dom = document.createElement('div');
    dom.innerHTML = `<h1># Hello world</h1>
<img src="testimg" width="50%"/>
<div># Hello</div>
## World <br>`;
    expect(domToMd(dom)).toEqual(`# Hello world
<img src="testimg" width="50%">
# Hello
## World 
`);
  });
});

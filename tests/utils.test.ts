import { domToText } from '../src/utils/dom-to-text';
import { describe, test, expect } from 'vitest';

describe('dom-to-text', () => {
  test('dom-to-md', () => {
    const dom = document.createElement('div');
    dom.innerHTML = `<h1># Hello world</h1>
<img src="testimg" width="50%"/>
<div># Hello</div>
## World <br>`;
    expect(domToText(dom)).toEqual(`# Hello world
<img src="testimg" width="50%">
# Hello
## World 
`);
  });
});

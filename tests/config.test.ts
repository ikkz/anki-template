import { configs } from '../build/config';
import { describe, expect, test } from 'vitest';

describe('config', () => {
  test('all config id should be different', () => {
    expect(new Set(configs.map(({ id }) => id)).size).eq(configs.length);
  });
});

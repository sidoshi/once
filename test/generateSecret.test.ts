import { generateSecret } from '../src/core';

describe('generateSecret', () => {
  test('generates secret of ascii length 12 by default', () => {
    expect(generateSecret().ascii.length).toEqual(12);
  });

  test('generates secret of given length when specified', () => {
    expect(generateSecret({ length: 32 }).ascii.length).toEqual(32);
  });
});

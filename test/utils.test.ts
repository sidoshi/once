import { rightShift } from '../src/utils';

describe('rightShift', () => {
  test('smaller numbers', () => {
    expect(rightShift(2, 1)).toEqual(1);
    expect(rightShift(4, 1)).toEqual(2);
    expect(rightShift(9, 2)).toEqual(2);
  });

  test('bigger numbers', () => {
    const shift = 8;
    const now = Date.now();
    const bin = now.toString(2);
    const shifted = bin.substring(0, bin.length - shift);
    expect(rightShift(now, shift).toString(2)).toEqual(shifted);
  });

  test('max number', () => {
    const shift = 8;
    const max = 0xffffffffffffffff;
    const bin = max.toString(2);
    const shifted = bin.substring(0, bin.length - shift);
    expect(rightShift(max, 8).toString(2)).toEqual(shifted);
  });
});

import { hotp } from '../src';

describe('HOTP verify', () => {
  const secret = '1234567890';

  test('passes when code matches', () => {
    const counter = 10;
    const code = hotp.generate({
      secret,
      counter,
    });

    expect(
      hotp.verify({
        code,
        counter,
        secret,
      })
    ).toEqual({ valid: true, delta: 0 });
  });

  test('fails when codes does not match', () => {
    const code = hotp.generate({
      secret,
      counter: 9,
    });

    expect(
      hotp.verify({
        code,
        counter: 10,
        secret,
      })
    ).toEqual({ valid: false });
  });

  test('passes when code matches one in window', () => {
    const counter = 15;
    const code = hotp.generate({
      secret,
      counter,
    });

    expect(
      hotp.verify({
        code,
        counter: 10,
        secret,
        window: 5,
      })
    ).toEqual({ valid: true, delta: 5 });
  });

  test('fails when code does not match one in window', () => {
    const counter = 15;
    const code = hotp.generate({
      secret,
      counter,
    });

    expect(
      hotp.verify({
        code,
        counter: 10,
        secret,
        window: 3,
      })
    ).toEqual({ valid: false });
  });
});

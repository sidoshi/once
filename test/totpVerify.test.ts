import { totp } from '../src';
import { timestamp } from '../src/utils';
import { generateCounterFromTime } from '../src/internals';

describe('TOTP verify', () => {
  const secret = '1234567890';

  test('passes when code matches', () => {
    const time = timestamp();
    const code = totp.generate({
      secret,
      time,
    });

    expect(
      totp.verify({
        code,
        secret,
        time,
      })
    ).toEqual({ valid: true, delta: 0 });
  });

  test('fails when codes does not match', () => {
    const time = timestamp() - 100;
    const code = totp.generate({
      secret,
      time,
    });

    expect(
      totp.verify({
        code,
        secret,
      })
    ).toEqual({ valid: false });
  });

  test('passes when code matches one in window ahead', () => {
    const counter = generateCounterFromTime(timestamp(), 30);
    const time = (counter + 2) * 30;
    const code = totp.generate({
      secret,
      time,
    });

    expect(
      totp.verify({
        code,
        secret,
        window: 3,
      })
    ).toEqual({ valid: true, delta: 2 });
  });

  test('passes when code matches one in window behind', () => {
    const counter = generateCounterFromTime(timestamp(), 30);
    const time = (counter - 3) * 30;
    const code = totp.generate({
      secret,
      time,
    });

    expect(
      totp.verify({
        code,
        secret,
        window: 3,
      })
    ).toEqual({ valid: true, delta: -3 });
  });

  test('fails when code does not match one in window', () => {
    const time = timestamp();
    const code = totp.generate({
      secret,
      time,
    });

    expect(
      totp.verify({
        code,
        time: time + 30 * 4,
        secret,
        window: 3,
      })
    ).toEqual({ valid: false });
  });
});

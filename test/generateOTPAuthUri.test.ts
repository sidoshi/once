import { generateOTPAuthUri } from '../src';

describe('generateOTPAuthUri', () => {
  test('hotp', () => {
    expect(
      generateOTPAuthUri({
        accountName: 'account@issuer.com',
        type: 'hotp',
        encoding: 'base32',
        secret: 'I42UWVZWKNCFQS2BLFDEGUZTIVFVMRSB',
        issuer: 'Issuer',
        counter: 10,
      })
    ).toMatchInlineSnapshot(
      `"otpauth://hotp/Issuer%3Aaccount%40issuer.com?secret=I42UWVZWKNCFQS2BLFDEGUZTIVFVMRSB&issuer=Issuer&algorithm=sha1&digits=6&counter=10"`
    );
  });

  test('totp', () => {
    expect(
      generateOTPAuthUri({
        accountName: 'account@issuer.com',
        type: 'totp',
        encoding: 'base32',
        secret: 'I42UWVZWKNCFQS2BLFDEGUZTIVFVMRSB',
        issuer: 'Issuer',
      })
    ).toMatchInlineSnapshot(
      `"otpauth://totp/Issuer%3Aaccount%40issuer.com?secret=I42UWVZWKNCFQS2BLFDEGUZTIVFVMRSB&issuer=Issuer&algorithm=sha1&digits=6&period=30"`
    );
  });

  test('overrides period for totp', () => {
    expect(
      generateOTPAuthUri({
        accountName: 'account@issuer.com',
        type: 'totp',
        encoding: 'base32',
        secret: 'I42UWVZWKNCFQS2BLFDEGUZTIVFVMRSB',
        issuer: 'Issuer',
        period: 40,
      })
    ).toMatchInlineSnapshot(
      `"otpauth://totp/Issuer%3Aaccount%40issuer.com?secret=I42UWVZWKNCFQS2BLFDEGUZTIVFVMRSB&issuer=Issuer&algorithm=sha1&digits=6&period=40"`
    );
  });

  test('converts secrets in other encodings to base32', () => {
    expect(
      generateOTPAuthUri({
        accountName: 'account@issuer.com',
        type: 'totp',
        encoding: 'ascii',
        secret: 'HFZFMQTDG5ME6MDNGNTQ',
        issuer: 'Issuer',
      })
    ).toMatchInlineSnapshot(
      `"otpauth://totp/Issuer%3Aaccount%40issuer.com?secret=JBDFURSNKFKEIRZVJVCTMTKEJZDU4VCR&issuer=Issuer&algorithm=sha1&digits=6&period=30"`
    );
  });
});

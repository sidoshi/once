/**
 * Test cases provided in RFC 4226.
 * See https://tools.ietf.org/html/rfc4226#page-32
 */

import { hmacHash, dynamicTruncate } from '../src/internals';
import { Encoding, Algorithm } from '../src/types';
import { hotp } from '../src';

const testcases = [
  {
    count: 0,
    hmac: 'cc93cf18508d94934c64b65d8ba7667fb7cde4b0',
    hotp: '755224',
    truncated: 1284755224,
  },
  {
    count: 1,
    hmac: '75a48a19d4cbe100644e8ac1397eea747a2d33ab',
    hotp: '287082',
    truncated: 1094287082,
  },
  {
    count: 2,
    hmac: '0bacb7fa082fef30782211938bc1c5e70416ff44',
    hotp: '359152',
    truncated: 137359152,
  },
  {
    count: 3,
    hmac: '66c28227d03a2d5529262ff016a1e6ef76557ece',
    hotp: '969429',
    truncated: 1726969429,
  },
  {
    count: 4,
    hmac: 'a904c900a64b35909874b33e61c5938a8e15ed1c',
    hotp: '338314',
    truncated: 1640338314,
  },
  {
    count: 5,
    hmac: 'a37e783d7b7233c083d4f62926c7a25f238d0316',
    hotp: '254676',
    truncated: 868254676,
  },
  {
    count: 6,
    hmac: 'bc9cd28561042c83f219324d3c607256c03272ae',
    hotp: '287922',
    truncated: 1918287922,
  },
  {
    count: 7,
    hmac: 'a4fb960c0bc06e1eabb804e5b397cdc4b45596fa',
    hotp: '162583',
    truncated: 82162583,
  },
  {
    count: 8,
    hmac: '1b3c89f65e6c9e883012052823443f048b4332db',
    hotp: '399871',
    truncated: 673399871,
  },
  {
    count: 9,
    hmac: '1637409809a679dc698207310c8c7fc07290d9e5',
    hotp: '520489',
    truncated: 645520489,
  },
];

describe('hmac values', () => {
  testcases.forEach(t => {
    test(`HMAc for count: ${t.count}`, () => {
      const options = {
        secret: '12345678901234567890',
        counter: t.count,
        encoding: 'ascii' as Encoding,
        algorithm: 'sha1' as Algorithm,
      };

      expect(hmacHash(options).toString('hex')).toEqual(t.hmac);
    });
  });
});

describe('hotp', () => {
  testcases.forEach(t => {
    test(`HOTP for count: ${t.count}`, () => {
      const options = {
        secret: '12345678901234567890',
        counter: t.count,
        encoding: 'ascii' as Encoding,
      };
      expect(hotp.generate(options)).toEqual(t.hotp);
    });
  });
});

describe('dynamic truncate', () => {
  testcases.forEach(t => {
    test(`dynamic truncate for HMAC: ${t.hmac}`, () => {
      expect(dynamicTruncate(Buffer.from(t.hmac, 'hex'))).toEqual(t.truncated);
    });
  });
});

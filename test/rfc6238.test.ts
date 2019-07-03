/**
 * Test cases provided in RFC 6238.
 * See https://tools.ietf.org/html/rfc6238#appendix-B
 */

import { totp } from '../src';
import { Algorithm, Encoding } from '../src/types';
import { generateCounterFromTime } from '../src/internals';
import { msToSec } from '../src/utils';

const testcases = [
  {
    time: 59,
    date: new Date('1970-01-01T00:00:59Z'),
    counter: 0x01,
    code: '94287082',
    algorithm: 'sha1',
  },
  {
    time: 59,
    date: new Date('1970-01-01T00:00:59Z'),
    counter: 0x01,
    code: '46119246',
    algorithm: 'sha256',
  },
  {
    time: 59,
    date: new Date('1970-01-01T00:00:59Z'),
    counter: 0x01,
    code: '90693936',
    algorithm: 'sha512',
  },
  {
    time: 1111111109,
    date: new Date('2005-03-18T01:58:29Z'),
    counter: 0x023523ec,
    code: '07081804',
    algorithm: 'sha1',
  },
  {
    time: 1111111109,
    date: new Date('2005-03-18T01:58:29Z'),
    counter: 0x023523ec,
    code: '68084774',
    algorithm: 'sha256',
  },
  {
    time: 1111111109,
    date: new Date('2005-03-18T01:58:29Z'),
    counter: 0x023523ec,
    code: '25091201',
    algorithm: 'sha512',
  },
  {
    time: 1111111111,
    date: new Date('2005-03-18T01:58:31Z'),
    counter: 0x023523ed,
    code: '14050471',
    algorithm: 'sha1',
  },
  {
    time: 1111111111,
    date: new Date('2005-03-18T01:58:31Z'),
    counter: 0x023523ed,
    code: '67062674',
    algorithm: 'sha256',
  },
  {
    time: 1111111111,
    date: new Date('2005-03-18T01:58:31Z'),
    counter: 0x023523ed,
    code: '99943326',
    algorithm: 'sha512',
  },
  {
    time: 1234567890,
    date: new Date('2009-02-13T23:31:30Z'),
    counter: 0x0273ef07,
    code: '89005924',
    algorithm: 'sha1',
  },
  {
    time: 1234567890,
    date: new Date('2009-02-13T23:31:30Z'),
    counter: 0x0273ef07,
    code: '91819424',
    algorithm: 'sha256',
  },
  {
    time: 1234567890,
    date: new Date('2009-02-13T23:31:30Z'),
    counter: 0x0273ef07,
    code: '93441116',
    algorithm: 'sha512',
  },
  {
    time: 2000000000,
    date: new Date('2033-05-18T03:33:20Z'),
    counter: 0x03f940aa,
    code: '69279037',
    algorithm: 'sha1',
  },
  {
    time: 2000000000,
    date: new Date('2033-05-18T03:33:20Z'),
    counter: 0x03f940aa,
    code: '90698825',
    algorithm: 'sha256',
  },
  {
    time: 2000000000,
    date: new Date('2033-05-18T03:33:20Z'),
    counter: 0x03f940aa,
    code: '38618901',
    algorithm: 'sha512',
  },
  {
    time: 20000000000,
    date: new Date('2603-10-11T11:33:20Z'),
    counter: 0x27bc86aa,
    code: '65353130',
    algorithm: 'sha1',
  },
  {
    time: 20000000000,
    date: new Date('2603-10-11T11:33:20Z'),
    counter: 0x27bc86aa,
    code: '77737706',
    algorithm: 'sha256',
  },
  {
    time: 20000000000,
    date: new Date('2603-10-11T11:33:20Z'),
    counter: 0x27bc86aa,
    code: '47863826',
    algorithm: 'sha512',
  },
];

describe('totp', () => {
  const secrets: Record<string, string> = {
    sha1: '12345678901234567890',
    sha256: '12345678901234567890'.repeat(2).slice(0, 32),
    sha512: '12345678901234567890'.repeat(4).slice(0, 64),
  };

  testcases.forEach(t => {
    test(`TOTP for time:${t.time} and algorithm:${t.algorithm}`, () => {
      const options = {
        secret: secrets[t.algorithm],
        encoding: 'ascii' as Encoding,
        algorithm: t.algorithm as Algorithm,
        time: t.time,
        digits: 8,
      };

      expect(totp(options)).toEqual(t.code);
    });
  });
});

describe('generateCounterFromTime', () => {
  testcases.forEach(t => {
    test(`counter for time: ${t.time}`, () => {
      expect(generateCounterFromTime(t.time, 30)).toEqual(t.counter);
    });

    test(`counter for date: ${t.date}`, () => {
      expect(generateCounterFromTime(msToSec(+t.date), 30)).toEqual(t.counter);
    });
  });
});

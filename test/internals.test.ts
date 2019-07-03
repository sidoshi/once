import { Buffer } from 'buffer';
import base32 from 'hi-base32';

import { timestamp } from '../src/utils';
import { createEncodedBuffer, createCounterBuffer } from '../src/internals';

describe('createEncodedBuffer', () => {
  test('base32', () => {
    const secret = base32.encode('Hello World');
    const buffer = createEncodedBuffer(secret, 'base32');
    expect(Buffer.isBuffer(buffer)).toEqual(true);
    expect(buffer.toString()).toEqual('Hello World');
  });

  // Often TOTP providers provides users with base32 encoded keys that have
  // spaces. Though, space is an invalid base32 character.
  // We need to sanitize such strings so that it does not contain any invalid
  // characters.
  test('base32 - sanitization', () => {
    const secret = 'JBSW Y3DP EBLW 64TM MQ';
    const buffer = createEncodedBuffer(secret, 'base32');
    expect(Buffer.isBuffer(buffer)).toEqual(true);
    expect(buffer.toString()).toEqual('Hello World');
  });

  test('base64', () => {
    const secret = Buffer.from('Hello World').toString('base64');
    const buffer = createEncodedBuffer(secret, 'base64');
    expect(Buffer.isBuffer(buffer)).toEqual(true);
    expect(buffer.toString()).toEqual('Hello World');
  });

  test('ascii', () => {
    const secret = Buffer.from('Hello World').toString('ascii');
    const buffer = createEncodedBuffer(secret, 'ascii');
    expect(Buffer.isBuffer(buffer)).toEqual(true);
    expect(buffer.toString()).toEqual('Hello World');
  });

  test('hex', () => {
    const secret = Buffer.from('Hello World').toString('hex');
    const buffer = createEncodedBuffer(secret, 'hex');
    expect(Buffer.isBuffer(buffer)).toEqual(true);
    expect(buffer.toString()).toEqual('Hello World');
  });
});

describe('createCounterBuffer', () => {
  test('creates buffer of 8 bytes', () => {
    const buffer = createCounterBuffer(1000);
    expect(buffer.length).toEqual(8);

    const timeBuffer = createCounterBuffer(timestamp());
    expect(timeBuffer.length).toEqual(8);
  });

  test('creates buffer that represents given number', () => {
    const time = Date.now();
    const buffer = createCounterBuffer(time);
    expect(parseInt(buffer.toString('hex'), 16)).toEqual(time);
  });
});

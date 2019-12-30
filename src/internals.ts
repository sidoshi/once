import { Buffer } from 'buffer';
import base32 from 'hi-base32';
import { sanitize } from 'sanitize-base32';
import createHmac from 'create-hmac';

import { Encoding, Algorithm } from './types';
import { rightShift, timestamp } from './utils';

/**
 * Convert the provided string to buffer using the provided encoding.
 */
export function createEncodedBuffer(str: string, encoding: Encoding): Buffer {
  if (encoding === 'base32') {
    const decoded = base32.decode.asBytes(sanitize(str));
    return Buffer.from(decoded);
  }

  return Buffer.from(str, encoding);
}

/**
 * Create an 8 byte buffer for the provided counter number.
 */
export function createCounterBuffer(counter: number): Buffer {
  // If the provided number is bigger than 2^SIZE bytes, we cycle back starting from 0
  const SIZE = 8;
  const buffer = Buffer.alloc(SIZE);
  let temp = counter;

  for (let i = SIZE - 1; i >= 0; i -= 1) {
    buffer[i] = temp & 0xff;
    // The binary right shift operator converts the number to a 32 bit number before performing the shift.
    // So any number greater than 4 bytes would yield unexpected results.
    // temp = temp >> 8;
    temp = rightShift(temp, 8);
  }

  return buffer;
}

/**
 * Generate counter number from the provided time if provided, otherwise using
 * the current time. The timestamp provided should be in seconds.
 */
export function generateCounterFromTime(
  time: number | undefined,
  step: number
): number {
  const seconds = time || timestamp();
  return Math.floor(seconds / step);
}

interface HashOptions {
  secret: string;
  counter: number;
  encoding: Encoding;
  algorithm: Algorithm;
}

/**
 * Generate HMAC hash for the provided key and counter using the specified
 * algorithm.
 */
export function hmacHash(options: HashOptions): Buffer {
  const secret = createEncodedBuffer(options.secret, options.encoding);
  const counter = createCounterBuffer(options.counter);

  const hmac = createHmac(options.algorithm, secret);
  hmac.update(counter);

  return hmac.digest();
}

/**
 * Truncate the HMAC hash using the algorithm provided in RFC 4226.
 * See: https://tools.ietf.org/html/rfc4226#page-7
 */
export function dynamicTruncate(hash: Buffer): number {
  const offset = hash[hash.length - 1] & 0xf;

  return (
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff)
  );
}

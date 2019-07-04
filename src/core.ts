import { Encoding, Algorithm } from './types';
import {
  generateCounterFromTime,
  hmacHash,
  dynamicTruncate,
} from './internals';

export interface HOTPGenerateOptions {
  // The secret key to use for HOTP generation
  secret: string;
  // The incremental counter value
  counter: number;
  // The length of generated OTP (default: 6)
  digits?: number;
  // The encoding in which the secret key is provided (default: 'ascii')
  encoding?: Encoding;
  // The algorithm to use for HMAC hashing (default: 'sha1')
  algorithm?: Algorithm;
}

const hoptDefaultOptions = {
  encoding: 'ascii' as Encoding,
  algorithm: 'sha1' as Algorithm,
  digits: 6,
};

/**
 * Generate HMAC based OTP.
 */
export function hotpGenerate(options: HOTPGenerateOptions): string {
  const opts = { ...hoptDefaultOptions, ...options };
  const hash = hmacHash(opts);
  const code = dynamicTruncate(hash);

  return code.toString().substr(-opts.digits);
}

export interface TOTPGenerateOptions {
  // The secret key to use for TOTP generation
  secret: string;
  // The timestamp in seconds to use (default: current time)
  time?: number;
  // Number of steps in seconds for incrementing counter (default: 30)
  step?: number;
  // The length of generated OTP (default: 6)
  digits?: number;
  // The encoding in which the secret key is provided (default: 'ascii')
  encoding?: Encoding;
  // The algorithm to use for HMAC hashing (default: 'sha1')
  algorithm?: Algorithm;
}

const totpDefaultOptions = {
  step: 30,
  digits: 6,
  encoding: 'ascii' as Encoding,
  algorithm: 'sha1' as Algorithm,
};

/**
 * Generate Time based OTP.
 */
export function totpGenerate(options: TOTPGenerateOptions): string {
  const opts = { ...totpDefaultOptions, ...options };
  const counter = generateCounterFromTime(opts.time, opts.step);

  return hotpGenerate({
    ...opts,
    counter,
  });
}

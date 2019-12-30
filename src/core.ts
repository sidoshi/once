import { format } from 'url';
import { randomstring } from '@sidoshi/random-string';

import { Encoding, Algorithm } from './types';
import { base32Encode } from './utils';
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

const hoptGenerateDefaults = {
  encoding: 'ascii' as Encoding,
  algorithm: 'sha1' as Algorithm,
  digits: 6,
};

/**
 * Generate HMAC based OTP.
 */
export function hotpGenerate(options: HOTPGenerateOptions): string {
  const opts = { ...hoptGenerateDefaults, ...options };
  const hash = hmacHash(opts);
  const code = dynamicTruncate(hash);

  return code.toString().substr(-opts.digits);
}

export interface HOTPVerifyOptions {
  // The secret key to use for HOTP verification
  secret: string;
  // The incremental counter value
  counter: number;
  // The OTP to verify against
  code: string;
  // The look-ahead window for resynchronization (default: 0)
  window?: number;
  // The length of generated OTP (default: 6)
  digits?: number;
  // The encoding in which the secret key is provided (default: 'ascii')
  encoding?: Encoding;
  // The algorithm to use for HMAC hashing (default: 'sha1')
  algorithm?: Algorithm;
}

const hotpVerifyDefaults = {
  ...hoptGenerateDefaults,
  window: 0,
};

export interface OTPVerificationResult {
  valid: boolean;
  delta?: number;
}

export function hotpVerify(options: HOTPVerifyOptions): OTPVerificationResult {
  const opts = { ...hotpVerifyDefaults, ...options };

  for (let c = opts.counter; c <= opts.counter + opts.window; c += 1) {
    const code = hotpGenerate({
      ...opts,
      counter: c,
    });

    // Convert the given code to string in case it is a number
    if (code === opts.code) {
      return {
        valid: true,
        delta: c - opts.counter,
      };
    }
  }

  return {
    valid: false,
  };
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

const totpGenerateDefaults = {
  step: 30,
  digits: 6,
  encoding: 'ascii' as Encoding,
  algorithm: 'sha1' as Algorithm,
};

/**
 * Generate Time based OTP.
 */
export function totpGenerate(options: TOTPGenerateOptions): string {
  const opts = { ...totpGenerateDefaults, ...options };
  const counter = generateCounterFromTime(opts.time, opts.step);

  return hotpGenerate({
    ...opts,
    counter,
  });
}

export interface TOTPVerifyOptions {
  // The secret key to use for TOTP verification
  secret: string;
  // The OTP to verify against
  code: string;
  // The two-sided leeway window for passcode resynchronization
  window?: number;
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

const totpVerifyDefaults = {
  ...totpGenerateDefaults,
  window: 0,
};

export function totpVerify(options: TOTPVerifyOptions): OTPVerificationResult {
  const opts = { ...totpVerifyDefaults, ...options };
  let counter = generateCounterFromTime(opts.time, opts.step);

  // Adjust 2-way window to 1-way
  counter -= opts.window;
  const window = opts.window * 2;

  const result = hotpVerify({
    ...opts,
    window,
    counter,
  });

  // Reset window adjustments
  if (result.valid && typeof result.delta === 'number') {
    result.delta -= opts.window;
  }

  return result;
}

interface SecretOptions {
  length?: number;
}

const defaultSecretOptions = {
  length: 12,
};

type SecretResult = {
  [k in Encoding]: string;
};

export function generateSecret(options: SecretOptions = {}): SecretResult {
  const opts = { ...defaultSecretOptions, ...options };
  const secret = randomstring(opts.length);

  return {
    ascii: secret,
    hex: Buffer.from(secret, 'ascii').toString('hex'),
    base32: base32Encode(secret, 'ascii'),
    base64: Buffer.from(secret, 'ascii').toString('base64'),
  };
}

type OTPAuthUriBaseOptions = {
  secret: string;
  encoding: Encoding;
  accountName: string;
  issuer: string;
  algorithm?: Algorithm;
  digits?: number;
};

export interface HOTPAuthUriOptions extends OTPAuthUriBaseOptions {
  type: 'hotp';
  counter: number;
}

export interface TOTPAuthUriOptions extends OTPAuthUriBaseOptions {
  type: 'totp';
  period?: number;
}

export type OTPAuthUriOptions = HOTPAuthUriOptions | TOTPAuthUriOptions;

const defaultOTPAuthURIOptions = {
  algorithm: 'sha1',
  digits: 6,
  period: 30,
};

export function generateOTPAuthUri(options: OTPAuthUriOptions) {
  const opts = { ...defaultOTPAuthURIOptions, ...options };
  const base32EncodedSecret = base32Encode(opts.secret, opts.encoding);

  const baseQuery = {
    secret: base32EncodedSecret,
    issuer: opts.issuer,
    algorithm: opts.algorithm,
    digits: opts.digits,
  };

  const query =
    opts.type === 'hotp'
      ? { ...baseQuery, counter: opts.counter }
      : { ...baseQuery, period: opts.period };

  const label = `${opts.issuer}:${opts.accountName}`;
  const pathname = encodeURIComponent(label);
  const hostname = opts.type;

  return format({
    protocol: 'otpauth',
    slashes: true,
    hostname,
    pathname,
    query,
  });
}

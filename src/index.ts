import { hotpGenerate, totpGenerate, hotpVerify, totpVerify } from './core';

export const hotp = {
  generate: hotpGenerate,
  verify: hotpVerify,
};

export const totp = {
  generate: totpGenerate,
  verify: totpVerify,
};

export {
  HOTPGenerateOptions,
  TOTPGenerateOptions,
  generateSecret,
} from './core';

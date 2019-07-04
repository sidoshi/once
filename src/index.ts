import { hotpGenerate, totpGenerate } from './core';

export const hotp = {
  generate: hotpGenerate,
};

export const totp = {
  generate: totpGenerate,
};

export { HOTPGenerateOptions, TOTPGenerateOptions } from './core';

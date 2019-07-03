/**
 * Right shifting large numbers causes problems when using the binary operator.
 * We use the arithmetic equivalent of right shift operator to avoid any
 * problems.
 *
 * See https://stackoverflow.com/questions/56866365
 */
export function rightShift(digit: number, n: number) {
  return Math.floor(digit / 2 ** n);
}

export function msToSec(ms: number) {
  return Math.floor(ms / 1000);
}

/**
 * Return the current UNIX timestamp in seconds instead of milliseconds.
 */
export function timestamp() {
  return msToSec(Date.now());
}

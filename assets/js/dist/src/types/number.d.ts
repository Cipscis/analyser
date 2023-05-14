import { TypeFn } from './TypeFn.js';
/**
 * If a value looks like a number, it will be converted to a number.
 * String representations of numbers are expected to usue the `'.'` character for a
 * decimal point, and optionally the `','` character for separators within the number.
 *
 * If a string looks like a number and also ends with a `'%'` character, it will be
 * divided by `100` to convert it into a percentage.
 */
export declare const number: TypeFn<number>;

import { TypeFn } from './TypeFn.js';
/**
 * Splits a string into an array of strings using `String.prototype.split`
 */
export declare function array(separator: string | RegExp, limit?: number): TypeFn<string[]>;

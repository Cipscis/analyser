import { TypeFn } from './TypeFn.js';

/**
 * Splits a string into an array of strings using `String.prototype.split`
 */
export function array(separator: string | RegExp, limit?: number): TypeFn<string[]> {
	return (value) => value.split(separator, limit);
}

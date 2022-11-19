import { TypeFn } from './TypeFn.js';

/**
 * Splits a string into an array of strings using `String.prototype.split`
 */
export function array(separator: string | RegExp, limit?: number): TypeFn<string[]> {
	return (value) => {
		const result = value.split(separator, limit);

		if (result.length === 1 && result[0] === '') {
			// Return `[]` instead of `['']`
			return [];
		} else {
			return result;
		}
	};
}

import { TypeFn } from './TypeFn.js';

/**
 * Used to create a {@linkcode TypeFn type function} that converts a string into an array of strings.
 *
 * The arguments are the same as those used by {@linkcode String.prototype.split}.
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

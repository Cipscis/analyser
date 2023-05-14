import { TypeFn } from './TypeFn.js';

import { boolean } from './boolean.js';
import { number } from './number.js';

/**
 * Combines the {@linkcode boolean} and {@linkcode number} {@linkcode TypeFn type functions}.
 *
 * If a value looks like it contains a boolean, it will be converted to a boolean.
 * Otherwise, if it looks like it contains a number, it will be convered to a number.
 */
export const value: TypeFn<boolean | number> = function value(value) {
	try {
		return boolean(value);
	} catch (e) {
		try {
			return number(value);
		} catch (e) {
			throw new Error(`Boolean or number value not found in '${value}'`);
		}
	}
};

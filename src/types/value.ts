import { TypeFn } from './TypeFn.js';

import { boolean } from './boolean.js';
import { number } from './number.js';

/**
 * Extracts boolean or number values from string representations if appropriate.
 *
 * No warnings will be generated if the value doesn't appear like a boolean or number.
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

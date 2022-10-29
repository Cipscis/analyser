import { TypeFn } from './TypeFn.js';

/**
 * Creates a function to extract a boolean value frorm a string representation using custom tests for truthiness and falsiness.
 *
 * If the value doesn't match either test, a warning will be generated.
 */
export function booleanCustom(truthy: string | RegExp, falsey: string | RegExp): TypeFn<boolean> {
	const boolean: TypeFn<boolean> = function boolean(value, locationIdentifier) {
		if (typeof truthy === 'string') {
			if (value === truthy) {
				return true;
			}
		} else {
			if (truthy.test(value)) {
				return true;
			}
		}

		if (typeof falsey === 'string') {
			if (value === falsey) {
				return false;
			}
		} else {
			if (falsey.test(value)) {
				return false;
			}
		}

		if (value) {
			console.warn(`Boolean value not found in '${value}', checking for ${truthy} or ${falsey}${locationIdentifier ? ` (${locationIdentifier})` : ''}`);
		}
		return null;
	};

	return boolean;
}

/**
 * Extracts a boolean value from a string representation, if it contains one.
 *
 * If the value doesn't appear like it represents a boolean, a warning will be generated.
 */
export const boolean = booleanCustom(/^\s*true\s*$/i, /^\s*false\s*$/i);

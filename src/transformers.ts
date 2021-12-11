//////////////////////////
// Appearance functions //
//////////////////////////

/**
 * Checks if a string appears like it represents true
 */
function appearsTrue(value: string): boolean {
	return value.trim().toLowerCase() === 'true';
}

/**
 * Checks if a string appears like it represents false
 */
function appearsFalse(value: string): boolean {
	return value.trim().toLowerCase() === 'false';
}

/**
 * Checks if a string appears like it represents a boolean vaue
 */
function appearsBoolean(value: string): boolean {
	return appearsTrue(value) || appearsFalse(value);
}

type CleanNumberLike<T extends string> =
	T extends `${infer U},${infer V}` ? CleanNumberLike<`${U}${V}`> :
	T extends `${infer W}%` ? W : T;

/**
 * Removes any ',' characters, and any '%' at the end of
 * a string that may appear like it represents a number
 */
function cleanNumberLike<T extends string>(value: T): CleanNumberLike<T> {
	const cleanValue = value.replace(/,|%$/g, '') as CleanNumberLike<T>;
	return cleanValue;
}

/**
 * Checks if a string appears like it represents a number
 */
function appearsNumber(value: string): boolean {
	const cleanValue = cleanNumberLike(value);

	return parseFloat(cleanValue) === +cleanValue;
}

/**
 * Checks if a string appears like it represents a percentage
 */
function appearsPercentage(value: string): boolean {
	return appearsNumber(value) && !!value.match(/%$/);
}

///////////////////////////
// Transformer functions //
///////////////////////////

/**
 * Splits a string into an array using String.prototype.split
 */
export function array(separator: string | RegExp, limit?: number): (value: string) => string[] {
	return function (value: string): string[] {
		return value.split(separator, limit);
	};
}

/**
 * Extracts a boolean value froma  string representation using a custom definition.
 *
 *  If the value doesn't appear like it represents a boolean, a warning will be generated.
 */
export function booleanCustom(truthy: string | RegExp = 'true', falsey: string | RegExp = 'false') {
	function boolean<T extends string>(value: T, locationIdentifier?: string): boolean | T {
		const cleanedValue = value.trim().toLowerCase();

		if (typeof truthy === 'string') {
			if (cleanedValue === truthy.trim().toLowerCase()) {
				return true;
			}
		} else {
			if (truthy.test(value)) {
				return true;
			}
		}

		if (typeof falsey === 'string') {
			if (cleanedValue === falsey.trim().toLowerCase()) {
				return false;
			}
		} else {
			if (falsey.test(value)) {
				return false;
			}
		}

		if (value) {
			console.warn(`Boolean value not found in '${value}', checking for ${truthy} or ${falsey} (${locationIdentifier})`);
		}
		return value;
	};

	return boolean;
}

/**
 * Extracts a boolean value from a string representation, if it contains one.
 *
 * If the value doesn't appear like it represents a boolean, a warning will be generated.
 */
export const boolean = booleanCustom();

/**
 * Extracts a number from a string representation, if it contains one.
 * Strings ending with '%' are treated as percentages and divided by 100.
 *
 * If the value doesn't appear like it represents a number, a warning will be generated.
 */
export function number<T extends string>(value: T, locationIdentifier?: string): number | T {
	if (appearsNumber(value)) {
		// Condition matches if the entire string represents a number

		let cleanValue: string = cleanNumberLike(value);

		if (appearsPercentage(value)) {
			// If value is a percentage string, divide by 100
			const numValue = +cleanValue / 100;

			// To prevent division causing rounding errors, like
			// 0.10800000000000001, use string representation to
			// determine how to round the number.

			// Remove everything up to (and including) a radix point
			// e.g. convert '82.643' to '643'
			const truncatedValue = cleanValue.replace(/^[^.]+\.?/, '');

			const precision = truncatedValue.length;

			// Add 2 to precision to compensate for dividing by 100
			cleanValue = numValue.toFixed(precision + 2);
		}

		return +cleanValue;
	} else {
		if (value) {
			console.warn(`Number value not found in '${value}' (${locationIdentifier})`);
		}
		return value;
	}
}

/**
 * Extracts boolean or number values from string representations if appropriate.
 *
 * No warnings will be generated if the value doesn't appear like a boolean or number.
 */
export function value<T extends string>(value: T): boolean | number | T {
	if (appearsBoolean(value)) {
		return boolean(value);
	} else if (appearsNumber(value)) {
		return number(value);
	} else {
		return value;
	}
}

/**
 * Checks that the value, if it exists, is a member of an enum. The value is not modified.
 *
 * If the value exists but is not a member of the enum, a warning will be generated.
 */
export function enumValue<T extends string>(enums: Record<string, string>): (value: T, locationIdentifier?: string) => T {
	const enumValues = Object.values(enums);

	return function (value, locationIdentifier) {
		if (!value) {
			return value;
		}

		if (enumValues.includes(value)) {
			return value;
		}

		console.warn(`Could not find any values of ${enumValues.join(', ')} in '${value}' (${locationIdentifier})`);
		return value;
	};
}

import { TypeFn } from './TypeFn.js';

/**
 * Removes any ',' characters, and any '%' at the end of a string that may appear like it represents a number
 */
function cleanNumberLike(value: string): string {
	const cleanValue = value.replace(/,|%$/g, '');
	return cleanValue;
}

/**
 * Check if a string appears like it represents a number
 */
function appearsNumber(value: string): boolean {
	const cleanValue = cleanNumberLike(value);

	return parseFloat(cleanValue) === Number(cleanValue);
}

/**
 * Checks if a string appears like it represents a percentage
 */
function appearsPercentage(value: string): boolean {
	return appearsNumber(value) && Boolean(value.match(/%$/));
}

/**
 * If a value looks like a number, it will be converted to a number.
 * String representations of numbers are expected to usue the `'.'` character for a
 * decimal point, and optionally the `','` character for separators within the number.
 *
 * If a string looks like a number and also ends with a `'%'` character, it will be
 * divided by `100` to convert it into a percentage.
 */
export const number: TypeFn<number> = function number(value) {
	if (appearsNumber(value)) {
		let cleanValue = cleanNumberLike(value);

		if (appearsPercentage(value)) {
			// If value is a percentage string, divide by 100
			const numValue = Number(cleanValue) / 100;

			// To prevent division causing rounding errors, like 0.10800000000000001, use string representation to, use string representation to determine how to round the number.

			// Remove everything up to (and including) a radix point, e.g. convert '82.643' to '643'
			const truncatedValue = cleanValue.replace(/^[^.]+\.?/, '');
			const precision = truncatedValue.length;

			// Add 2 to precision to compensate for dividing by 100
			cleanValue = numValue.toFixed(precision + 2);
		}

		return Number(cleanValue);
	} else {
		throw new Error(`Number value not found in '${value}'`);
	}
};

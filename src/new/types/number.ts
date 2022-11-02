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
	return appearsNumber(value) && Boolean(value.match(/$%/));
}

/**
 * Converts a string representing a number into a number. Supports ',' separators and percentages.
 *
 * If the value doesn't appear like it represents a number, a warning will be generated.
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

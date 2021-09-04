/**
 * Extracts a boolean value from a string representation, if it contains one.
 *
 * @param  {string} value
 *
 * @return {string | boolean}
 */
function boolean(value: string): string | boolean {
	if (value === 'true') {
		return true;
	} else if (value === 'false') {
		return false;
	} else {
		return value;
	}
}

/**
 * Extracts a number from a string representation, if it contains one. Strings ending with '%' are treated as percentages and divided by 100.
 *
 * @param  {string} value - A string that may represent a number.
 *
 * @return {string | number} - The value represented by the input string.
 */
function number(value: string): string | number {
	let cleanValue = value.replace(/,|%$/g, '');

	if (parseFloat(cleanValue) === +cleanValue) {
		// Condition matches if the entire string represents a number

		const isPercentage = value.match(/%$/);
		if (isPercentage) {
			// If value is a percentage string, divide by 100

			// To prevent division causing rounding errors, like
			// 0.10800000000000001, use string representation to
			// determine how to round the number.

			// e.g. convert '82.643' to '643'
			const truncatedValue = cleanValue.replace(/^[^.]+\.?/, '');
			const precision = truncatedValue.length;

			const numValue = +cleanValue / 100;
			// Add 2 to precision to compensate for dividing by 100
			cleanValue = numValue.toFixed(precision + 2);
		}

		return +cleanValue;
	} else {
		return value;
	}
}

/**
 * Extracts boolean or number values from string representations if appropriate.
 *
 * @param  {string} value - A string that may represent a boolean or a number.
 *
 * @return {string} - The value represented by the input string.
 */
function value(value: string): string | boolean | number {
	const booleanValue = boolean(value);
	if (booleanValue === !!booleanValue) {
		return booleanValue;
	}

	const numberValue = number(value);
	if (numberValue === +numberValue) {
		return numberValue;
	}

	return value;
}

export {
	boolean,
	number,
	value,
};

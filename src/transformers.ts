//////////////////////////
// Appearance functions //
//////////////////////////

export interface TransformerFn<T> {
	(value: string, locationIdentifier?: string): T extends any[] ? T : (T | null)
}

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

type NoCommas<T extends string> = T extends `${infer U},${infer V}` ? NoCommas<`${U}${V}`> : T;
type NoPercent<T extends string> = T extends `${infer W}%` ? W : T;
type CleanNumberLike<T extends string> = NoCommas<NoPercent<T>>;

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
export function array(separator: string | RegExp, limit?: number): TransformerFn<string[]> {
	return function (value: string): string[] {
		return value.split(separator, limit);
	};
}

/**
 * Extracts a boolean value from a string representation using a custom definition.
 *
 *  If the value doesn't appear like it represents a boolean, a warning will be generated.
 */
export function booleanCustom(truthy: string | RegExp = 'true', falsey: string | RegExp = 'false'): TransformerFn<boolean> {
	return function (value: string, locationIdentifier?: string): boolean | null {
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
		return null;
	};
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
export const number: TransformerFn<number> = (value: string, locationIdentifier?: string): number | null => {
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
		return null;
	}
}

/**
 * Extracts boolean or number values from string representations if appropriate.
 *
 * No warnings will be generated if the value doesn't appear like a boolean or number.
 */
export const value: TransformerFn<boolean | number> = (value: string, locationIdentifier?: string): boolean | number | null => {
	if (appearsBoolean(value)) {
		return boolean(value);
	} else if (appearsNumber(value)) {
		return number(value);
	} else {
		console.warn(`Boolean or number value not found in '${value}' (${locationIdentifier})`);
		return null;
	}
}

/**
 * Checks that the value, if it exists, is a member of an enum.
 *
 * If the value does not exist, it is transformed to null.
 *
 * If a recoding map is passed, and it contains instructions for this value, it is recoded first.
 *
 * If the value exists but it is not a member of the enum and cannot be recoded,
 * a warning will be generated and null will be returned.
 */
export function enumValue<E extends string>(enums: Record<string, E>, recodeMap?: Record<string, E>): TransformerFn<E> {
	const enumValues: E[] = Object.values(enums);

	function isEnumMember(val: unknown): val is E {
		return (enumValues as any[]).includes(val);
	}

	const transformer = ((value: string, locationIdentifier?: string) => {
		if (!value) {
			return null;
		}

		if (isEnumMember(value)) {
			return value;
		}

		if (recodeMap && value in recodeMap) {
			const recodedValue = recodeMap[value];
			return recodedValue;
		}

		console.warn(`Value '${value}' does not exist within ${enumValues.join(', ')} (${locationIdentifier})`);
		return null;
	}) as TransformerFn<E>;
	// Need to use a type assertion here as TypeScript doesn't know how to use the generic constraint to resolve the conditional type
	// See https://stackoverflow.com/questions/70553130/typescript-generic-conditional-type-as-return-value-for-generic-function/70553240#70553240

	return transformer;
}

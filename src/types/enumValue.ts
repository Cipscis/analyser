import { TypeFn } from './TypeFn.js';

/**
 * Checks that the value, if it exists, is a member of an enum.
 *
 * If a recoding map is passed, and it contains instructions for this value, it is recoded first.
 *
 * If the value exists but it is not a member of the enum and cannot be recoded, a warning will be generated.
 */
export function enumValue<E extends string>(enums: Record<string, E>, recodeMap?: Record<string, E>): TypeFn<E> {
	const enumValues = Object.values(enums);

	function isEnumMember(val: unknown): val is E {
		// Use `as unknown[]` so TypeScript doesn't complain when using Array.prototype.includes
		return (enumValues as unknown[]).includes(val);
	}

	const enumValue: TypeFn<E> = function enumValue(value) {
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

		throw new Error(`Value '${value}' does not exist within ${enumValues.join(', ')}`);
	} as TypeFn<E>;
	// Need to use a type assertion here as TypeScript doesn't know how to use the generic constraint to resolve the conditional type
	// See https://stackoverflow.com/questions/70553130/typescript-generic-conditional-type-as-return-value-for-generic-function/70553240#70553240

	return enumValue;
}

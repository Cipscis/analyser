import { TypeFn } from './TypeFn.js';
import { isIterable } from '../util.js';

/**
 * Used to create a custom {@linkcode TypeFn type function} that ensures that a value exists within
 * an object like a string {@link https://www.typescriptlang.org/docs/handbook/enums.html TypeScript enum}.
 *
 * @param [recodeMap]
 * By default, this function doesn't transform the values passed into it. Instead, it acts as a check that they
 * exist within the passed `enum`.
 *
 * However, this optional parameter can be used to transform strings that don't exist within the `enum` into
 * strings that are members. These transformations are applied *before* the value's membership is checked.
 * This can be particularly useful for data cleaning.
 *
 * If this argument is an `Iterable<[string, E]>`, such as a {@linkcode Map}, only the first matching entry will be used.
 */
export function enumValue<E extends string>(enums: Record<string, E>, recodeMap?: Record<string, E> | Iterable<[string, E]>): TypeFn<E> {
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

		if (recodeMap) {
			if (isIterable(recodeMap)) {
				for (const [testValue, recodedValue] of recodeMap) {
					if (testValue === value) {
						return recodedValue;
					}
				}
			} else {
				const recodedValue = recodeMap[value];
				return recodedValue;
			}
		}

		throw new Error(`Value '${value}' does not exist within ${enumValues.join(', ')}`);
	} as TypeFn<E>;
	// Need to use a type assertion here as TypeScript doesn't know how to use the generic constraint to resolve the conditional type
	// See https://stackoverflow.com/questions/70553130/typescript-generic-conditional-type-as-return-value-for-generic-function/70553240#70553240

	return enumValue;
}

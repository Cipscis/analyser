import { TypeFn } from './TypeFn.js';

export type ExtendableArrayTypeFn = TypeFn<string[]> & {
	/**
	 * Used to create a modified version of the {@linkcode TypeFn type function} created by
	 * {@linkcode array}, which further converts the array of strings into a typed array. The type
	 * of the elements within the array is determined based on a type function provided as an argument.
	 *
	 * @example
	 * ```typescript
	 * export { types } from '@cipscis/analyser';
	 *
	 * const arrayOfNumbers = types.array(',').of(types.number);
	 * ```
	 */
	of<T>(typeFn: TypeFn<T>): TypeFn<T[]>
}

/**
 * Used to create a {@linkcode TypeFn type function} that converts a string into an array of strings.
 *
 * The arguments are the same as those used by {@linkcode String.prototype.split}.
 *
 * @see {@linkcode ExtendableArrayTypeFn.of|.of} for creating a type function that creates a typed array.
 */
export function array(
	separator: string | RegExp, limit?: number
): ExtendableArrayTypeFn {
	const arrTypeFn = (value: string) => {
		if (value === '') {
			// Return `[]` instead of `['']`
			return [];
		}

		const result = value.split(separator, limit);
		return result;
	};

	arrTypeFn.of = function of<T>(typeFn: TypeFn<T>): TypeFn<T[]> {
		return function (value) {
			const arr = arrTypeFn(value);
			const typedArr = arr.map(typeFn);
			return typedArr;
		};
	};

	return arrTypeFn;
}

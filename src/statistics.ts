function getNumArray(val: number[] | [number[]]): number[] {
	if (
		((value: unknown[]): value is [number[]] => {
			return value.length === 1 && Array.isArray(value[0]);
		})(val)
	) {
		return val[0];
	} else {
		return val;
	}
}

/**
 * Return the sum of an array of numbers.
 */
export function sum(...arr: number[] | [number[]]): number {
	const numbers = getNumArray(arr);

	return numbers.reduce(function (sum: number, val: number) {
		return sum + val;
	}, 0);
}

/**
 * Returns the mean of an array of numbers.
 */
export function mean(...arr: number[] | [number[]]): number {
	const numbers = getNumArray(arr);

	return sum(numbers) / numbers.length;
}

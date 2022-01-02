function getNumArray(val: number[] | [number[]]): number[] {
	if (val.length === 1 && Array.isArray(val[0])) {
		return val[0];
	} else {
		return val as number[];
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
 * Returns the maximum of an array of numbers.
 */
export function max(...arr: number[] | [number[]]): number {
	const numbers = getNumArray(arr);

	return Math.max(...numbers);
}

/**
 * Returns the mean of an array of numbers.
 */
export function mean(...arr: number[] | [number[]]): number {
	const numbers = getNumArray(arr);

	return sum(numbers) / numbers.length;
}

/**
 * Returns the minimum of an array of numbers.
 */
export function min(...arr: number[] | [number[]]): number {
	const numbers = getNumArray(arr);

	return Math.min(...numbers);
}

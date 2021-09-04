/**
 * Return the sum of an array of numbers.
 *
 * @param  {number[]} arr
 *
 * @return {number}
 */
function sum(arr: number[]): number {
	return arr.reduce(function (sum: number, val: number) {
		return sum + val;
	}, 0);
}

/**
 * Returns the maximum of an array of numbers.
 *
 * @param  {number[]} arr
 *
 * @return {number}
 */
function max(arr: number[]): number {
	return Math.max(...arr);
}

/**
 * Returns the mean of an array of numbers.
 *
 * @param  {number[]} arr
 *
 * @return {number}
 */
function mean(arr: number[]): number {
	return sum(arr) / arr.length;
}

/**
 * Returns the minimum of an array of numbers.
 *
 * @param  {number[]} arr
 *
 * @return {number}
 */
function min(arr: number[]): number {
	return Math.min(...arr);
}

export {
	sum,
	max,
	mean,
	min,
};

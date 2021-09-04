function sum(arr: number[]): number {
	return arr.reduce(function (sum: number, val: number) {
		return sum + val;
	}, 0);
}

function max(arr: number[]): number {
	return Math.max(...arr);
}

function mean(arr: number[]): number {
	return sum(arr) / arr.length;
}

function min(arr: number[]): number {
	return Math.min(...arr);
}

export {
	sum,
	max,
	mean,
	min,
};

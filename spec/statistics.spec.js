import * as statistics from '../dist/statistics.js';

describe(`sum`, () => {
	it(`returns the sum of an array of numbers`, () => {
		expect(statistics.sum([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(55);
		expect(statistics.sum(-1, 1, -1, 1, -1, 1)).toBe(0);
	});
});

describe(`mean`, () => {
	it(`returns the mean of an array of numbers`, () => {
		expect(statistics.mean([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(5.5);
		expect(statistics.mean(-1, 1, -1, 1, -1, 1)).toBe(0);
	});
});

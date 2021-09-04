import * as analyser from '../dist/analyser.js';

import { fetch } from './mocks/fetch.mock.js';
global.fetch = fetch;

describe(`analyser`, () => {
	describe(`getColNumber`, () => {
		it(`converts a column name string into a number`, () => {
			let colName = 'A';
			let colNumber = analyser.getColNumber(colName);

			expect(colNumber).toBe(0);

			colName = 'gy';
			colNumber = analyser.getColNumber(colName);

			expect(colNumber).toBe(206);
		});

		it(`leaves non-negative integers untouched`, () => {
			let colName = 0;
			let colNumber = analyser.getColNumber(colName);

			expect(colNumber).toEqual(colName);

			colName = 36;
			colNumber = analyser.getColNumber(colName);

			expect(colNumber).toEqual(colName);
		});

		it(`returns null if passed an invalid type of input`, () => {
			expect(analyser.getColNumber(-1)).toBe(null);

			expect(analyser.getColNumber(1.5)).toBe(null);

			expect(analyser.getColNumber(['ab'])).toBe(null);
		});

		it(`returns null if passed an invalid string`, () => {
			expect(analyser.getColNumber('a b')).toBe(null);

			expect(analyser.getColNumber('')).toBe(null);
		});
	});

	describe(`getColNumbers`, () => {
		it(`converts an object of column names into an equivalent object of column numbers`, () => {
			const colNames = {
				A: 'A',
				B: 'B',
				AX: 'AX',
				ZZZ: 'ZZZ',
				posInt: 3,
			};

			const colNumbers = analyser.getColNumbers(colNames);

			expect(colNumbers).toEqual({
				A: 0,
				B: 1,
				AX: 49,
				ZZZ: 18277,
				posInt: 3,
			});
		});
	});

	describe(`loadFile`, () => {
		it(`resolves to a single object when loading a single file`, async () => {
			const fileConfig = {
				path: 'city example.csv',
				cols: {},
			};

			let response = analyser.loadFile(fileConfig);

			expect(response).toBeInstanceOf(Promise);
		});

		it('resolves to a single object when loading a single file', async () => {
			let fileConfig = {
				path: 'city example.csv',
			};


			expect(data).not.toBeInstanceOf(Array);
		});

		it(`resolves to an array of objects when loading multiple files`, async () => {
			const fileConfigs = [
				{
					path: 'city example.csv',
					cols: {},
				},
				{
					path: 'city example 2.csv',
					cols: {},
				},
			];

			const dataArr = await analyser.loadFile(...fileConfigs);

			expect(dataArr).toBeInstanceOf(Array);
			expect(dataArr.length).toBe(fileConfigs.length);
		});
	});
});

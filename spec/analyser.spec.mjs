import * as analyser from '../analyser.js';

import { fetch } from './mocks/fetch.mock.mjs';
global.fetch = fetch;

describe('analyser', () => {
	describe('getColNumber', () => {
		it('converts a column name string into a number', () => {
			let colName = 'A';
			let colNumber = analyser.getColNumber(colName);

			expect(colNumber).toBe(0);

			colName = 'gy';
			colNumber = analyser.getColNumber(colName);

			expect(colNumber).toBe(206);
		});

		it('leaves non-negative integers untouched', () => {
			let colName = 0;
			let colNumber = analyser.getColNumber(colName);

			expect(colNumber).toEqual(colName);

			colName = 36;
			colNumber = analyser.getColNumber(colName);

			expect(colNumber).toEqual(colName);
		});

		it('returns null if passed an invalid type of input', () => {
			expect(analyser.getColNumber(-1)).toBe(null);

			expect(analyser.getColNumber(1.5)).toBe(null);

			expect(analyser.getColNumber(['ab'])).toBe(null);
		});

		it('returns null if passed an invalid string', () => {
			expect(analyser.getColNumber('a b')).toBe(null);

			expect(analyser.getColNumber('')).toBe(null);
		});
	});

	describe('getColNumbers', () => {
		it('converts an object of column names into an equivalent object of column numbers', () => {
			let colNames = {
				A: 'A',
				B: 'B',
				AX: 'AX',
				ZZZ: 'ZZZ',
				posInt: 3,
			};

			let colNumbers = analyser.getColNumbers(colNames);

			expect(colNumbers).toEqual({
				A: 0,
				B: 1,
				AX: 49,
				ZZZ: 18277,
				posInt: 3,
			});
		});
	});

	describe('loadFile', () => {
		it('loads a file', async () => {
			let fileConfig = {
				path: 'city example.csv',
				headerRows: 1,
				cols: {
					NAME: 'A',
					COUNTRY: 'B',
					POPULATION: 'C',
					CAPITAL: 'D',
					PUBLIC_TRANSPORT: 'E',
					MAYOR_2012: 'F',
					MAYOR_2018: 'G',
				},
				arrayCols: {},
				aliases: {
					COUNTRY: [
						['New Zealand', 'Aotearoa']
					]
				},
				enumsMap: {}
			};
			fileConfig.arrayCols[fileConfig.cols.PUBLIC_TRANSPORT] = ',';
			fileConfig.arrayCols[fileConfig.cols.MAYOR_2018] = ',';

			let data = await analyser.loadFile(fileConfig);

			console.log(data);
		});
	});
});

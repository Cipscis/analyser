import * as analyser from '../dist/analyser.js';

import { fetch } from './mocks/fetch.mock.js';
global.fetch = fetch;

import { exampleAConfig, exampleBConfig, exampleCConfig } from
'./data/example.config.js';

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

			const data = await analyser.loadFile(fileConfig);

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

		it(`reads all rows from a file`, async () => {
			const fileConfig = {
				path: 'city example.csv',
				cols: {},
			};

			const { rows } = await analyser.loadFile(fileConfig);

			expect(rows.length).toBe(10);
		});

		it(`trims header rows`, async () => {
			const fileConfig = Object.assign({}, exampleAConfig);
			fileConfig.headerRows = 1;
			fileConfig.footerRows = 0;

			const { rows, cols } = await analyser.loadFile(fileConfig);

			expect(rows.length).toBe(9);
			expect(rows[0][cols.NAME]).toBe('Auckland');
		});

		it(`trims footer rows`, async () => {
			const fileConfig = Object.assign({}, exampleAConfig);
			fileConfig.headerRows = 0;
			fileConfig.footerRows = 1;

			const { rows, cols } = await analyser.loadFile(fileConfig);

			expect(rows.length).toBe(9);
			expect(rows[rows.length-1][cols.NAME]).toBe('Dunedin');
		});
	});

	describe(`filtering`, () => {
		let rows;
		let cols;
		let by;

		beforeEach(async () => {
			const dataConfig = await analyser.loadFile(exampleAConfig);
			rows = dataConfig.rows;
			cols = dataConfig.cols;
			by = dataConfig.by;
		});

		it(`lets you use the 'by' function`, async () => {
			const filteredRows = rows.filter(by(cols.NAME, 'Auckland'));

			expect(filteredRows.length).toBe(1);
			expect(filteredRows[0][cols.NAME]).toBe('Auckland');
		});

		it(`lets you filter by an array of values`, async () => {
			const filteredRows = rows.filter(by(cols.NAME, ['Taupō', 'Hamburg']));

			expect(filteredRows.length).toBe(2);
			expect(filteredRows[0][cols.NAME]).toBe('Taupō');
			expect(filteredRows[1][cols.NAME]).toBe('Hamburg');
		});

		it(`lets you filter by a function`, async () => {
			const filteredRows = rows.filter(by(cols.POPULATION, (pop) => pop > 1000));

			expect(filteredRows.length).toBe(3);
			expect(filteredRows[0][cols.NAME]).toBe('Auckland');
			expect(filteredRows[1][cols.NAME]).toBe('Hamburg');
			expect(filteredRows[2][cols.NAME]).toBe('Sydney');
		});

		it(`respects aliases`, async () => {
			const filteredRows = rows.filter(by(cols.COUNTRY, 'Aotearoa'));

			expect(filteredRows.length).toBe(7);
		});

		it(`lets you build an AND filter using 'andBy'`, async () => {
			const filteredRows = rows.filter(
				by(cols.POPULATION, (pop) => pop > 300)
				.andBy(cols.COUNTRY, 'New Zealand')
			);

			expect(filteredRows.length).toBe(3);
			expect(filteredRows[0][cols.NAME]).toBe('Auckland');
			expect(filteredRows[1][cols.NAME]).toBe('Wellington');
			expect(filteredRows[2][cols.NAME]).toBe('Christchurch');
		});

		it(`lets you build an OR filter using 'orBy'`, async () => {
			const filteredRows = rows.filter(
				by(cols.POPULATION, (pop) => pop < 150)
				.orBy(cols.COUNTRY, 'Germany')
			);

			expect(filteredRows.length).toBe(4);
			expect(filteredRows[0][cols.NAME]).toBe('Taupō');
			expect(filteredRows[1][cols.NAME]).toBe('Hamburg');
			expect(filteredRows[2][cols.NAME]).toBe('Dunedin');
			expect(filteredRows[3][cols.NAME]).toBe('Tauranga');
		});

		it(`lets you build a complex filter using both 'orBy' and 'andBy'`, async () => {
			const filteredRows = rows.filter(
				by(cols.POPULATION, (pop) => pop < 150)
				.andBy(cols.COUNTRY, 'New Zealand')
				.orBy(cols.COUNTRY, 'Germany')
			);

			expect(filteredRows.length).toBe(4);
			expect(filteredRows[0][cols.NAME]).toBe('Taupō');
			expect(filteredRows[1][cols.NAME]).toBe('Hamburg');
			expect(filteredRows[2][cols.NAME]).toBe('Dunedin');
			expect(filteredRows[3][cols.NAME]).toBe('Tauranga');
		});

		it(`returns an empty AnalyserRows if nothing matches the filter`, async () => {
			const filteredRows = rows.filter(by(cols.COUNTRY, 'COLOMBIA'));

			expect(filteredRows.length).toBe(0);
		});
	});
});

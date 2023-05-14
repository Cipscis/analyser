import * as analyser from '../dist/index.js';

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
				A: ['A'],
				B: ['B'],
				AX: ['AX'],
				ZZZ: ['ZZZ'],
				posInt: [3],
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

	describe(`getColNumbers`, () => {
		it(`excludes columns with invalid identifiers`, () => {
			const colNames = {
				A: ['A'],
				B: ['Ā'],
				C: [-1],
				D: [1.5],
				E: [null],
			};

			const colNumbers = analyser.getColNumbers(colNames);

			expect(colNumbers).toEqual({
				A: 0,
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

			expect(data).toBeInstanceOf(Array);
			expect(data[0]).not.toBeInstanceOf(Array);
		});

		it(`reads all rows from a file`, async () => {
			const fileConfig = {
				path: 'city example.csv',
				cols: {},
			};

			const rows = await analyser.loadFile(fileConfig);

			expect(rows.length).toBe(10);
		});

		it(`trims header rows`, async () => {
			const fileConfig = Object.assign({}, exampleAConfig);
			fileConfig.headerRows = 1;
			fileConfig.footerRows = 0;

			const rows = await analyser.loadFile(fileConfig);

			expect(rows.length).toBe(9);
			expect(rows[0].name).toBe('Auckland');
		});

		it(`trims footer rows`, async () => {
			const fileConfig = Object.assign({}, exampleAConfig);
			fileConfig.headerRows = 1;
			fileConfig.footerRows = 1;

			const rows = await analyser.loadFile(fileConfig);

			expect(rows.length).toBe(8);
			expect(rows[rows.length-1].name).toBe('Dunedin');
		});

		it(`trims ignored rows`, async() => {
			const fileConfig = Object.assign({}, exampleAConfig);
			fileConfig.ignoreRows = (row) => row.name === 'Auckland' || row.name === 'Tauranga';

			const rows = await analyser.loadFile(fileConfig);

			expect(rows.length).toBe(7);
			expect(rows[0].name).toBe('Taupō');
			expect(rows[rows.length-1].name).toBe('Dunedin');
		});
	});
});

import * as analyser from '../dist/new/index.js';

import { fetch } from './mocks/fetch.mock.js';
global.fetch = fetch;

import { exampleAConfig, exampleBConfig, exampleCConfig } from
'./data/example.config.js';

describe(`Data`, () => {
	let rows;

	beforeEach(async () => {
		rows = await analyser.loadFile(exampleAConfig);
	});

	describe(`addCol`, () => {
		it(`adds an array of the right length as a new column`, () => {
			const pop = rows.map(({ population }) => population);
			const popTrue = pop.map((pop) => pop * 1000);

			const rowsWithTruePop = rows.addCol('populationTrue', popTrue);
			expect(Array.isArray(rowsWithTruePop)).toBe(true);
			expect(rowsWithTruePop.length).toBe(pop.length);

			const popTrueInRows = rowsWithTruePop.map(({ populationTrue }) => populationTrue);
			expect(popTrueInRows).toEqual(popTrue);
		});

		it(`throws an error if a column of the wrong length is passed`, () => {
			const shortCol = [1, 2, 3];

			expect(() => rows.addCol('short', shortCol)).toThrowError();
		});

		it(`accepts a function to create a new derived column based on the row`, () => {
			const getTruePop = (row) => row.population * 1000;

			const rowsWithTruePop = rows.addCol('populationTrue', getTruePop);
			expect(Array.isArray(rowsWithTruePop)).toBe(true);
			expect(rowsWithTruePop.length).toBe(rows.length);

			const popTrueFromMap = rows.map(({ population }) => population * 1000);
			const popTrueInRows = rowsWithTruePop.map(({ populationTrue }) => populationTrue);
			expect(popTrueInRows).toEqual(popTrueFromMap);

			const getIndex = (row, i) => i;
			const rowsWithIndex = rows.addCol('index', getIndex);
			expect(Array.isArray(rowsWithIndex)).toBe(true);
			expect(rowsWithIndex.length).toBe(rows.length);

			const indexCol = rowsWithIndex.map(({ index }) => index);
			const indexFromMap = rows.map((row, i) => i);
			expect(indexCol).toEqual(indexFromMap);
		});

		it(`doesn't modify the original rows`, () => {
			const rowsWithNewCol = rows.addCol('test', () => true);

			expect(rows.map(({ test }) => test).every((el) => typeof el === 'undefined')).toBe(true);
			expect(rowsWithNewCol.every((el, i) => el !== rows[i])).toBe(true);
		});
	});
});

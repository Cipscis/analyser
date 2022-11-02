import * as analyser from '../dist/new/index.js';

import { fetch } from './mocks/fetch.mock.js';
global.fetch = fetch;

import { exampleAConfig, exampleBConfig, exampleCConfig } from
'./data/example.config.js';

describe(`Data`, () => {
	let rows;

	beforeEach(async () => {
		const dataConfig = await analyser.loadFile(exampleAConfig);
		rows = dataConfig.rows;
	});

	describe(`addCol`, () => {
		it(`adds an array of the right length as a new column`, () => {
			const pop = rows.map(({ POPULATION }) => POPULATION);
			const popTrue = pop.map((pop) => pop * 1000);

			const rowsWithTruePop = rows.addCol('POPULATION_TRUE', popTrue);
			expect(Array.isArray(rowsWithTruePop)).toBe(true);
			expect(rowsWithTruePop.length).toBe(pop.length);

			const popTrueInRows = rowsWithTruePop.map(({ POPULATION_TRUE }) => POPULATION_TRUE);
			expect(popTrueInRows).toEqual(popTrue);
		});

		it(`throws an error if a column of the wrong length is passed`, () => {
			const shortCol = [1, 2, 3];

			expect(() => rows.addCol('SHORT', shortCol)).toThrowError();
		});

		it(`accepts a function to create a new derived column based on the row`, () => {
			const getTruePop = (row) => row.POPULATION * 1000;

			const rowsWithTruePop = rows.addCol('POPULATION_TRUE', getTruePop);
			expect(Array.isArray(rowsWithTruePop)).toBe(true);
			expect(rowsWithTruePop.length).toBe(rows.length);

			const popTrueFromMap = rows.map(({ POPULATION }) => POPULATION * 1000);
			const popTrueInRows = rowsWithTruePop.map(({ POPULATION_TRUE }) => POPULATION_TRUE);
			expect(popTrueInRows).toEqual(popTrueFromMap);

			const getIndex = (row, i) => i;
			const rowsWithIndex = rows.addCol('INDEX', getIndex);
			expect(Array.isArray(rowsWithIndex)).toBe(true);
			expect(rowsWithIndex.length).toBe(rows.length);

			const indexCol = rowsWithIndex.map(({ INDEX }) => INDEX);
			const indexFromMap = rows.map((row, i) => i);
			expect(indexCol).toEqual(indexFromMap);
		});

		it(`doesn't modify the original rows`, () => {
			const rowsWithNewCol = rows.addCol('TEST', () => true);

			expect(rows.map(({ TEST }) => TEST).every((el) => typeof el === 'undefined')).toBe(true);
			expect(rowsWithNewCol.every((el, i) => el !== rows[i])).toBe(true);
		});
	});
});

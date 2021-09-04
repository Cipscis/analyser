import * as analyser from '../dist/analyser.js';

import { fetch } from './mocks/fetch.mock.js';
global.fetch = fetch;

import { exampleAConfig, exampleBConfig, exampleCConfig } from
'./data/example.config.js';

describe(`AnalyserRows`, () => {
	let rows;
	let cols;

	beforeEach(async () => {
		const dataConfig = await analyser.loadFile(exampleAConfig);
		rows = dataConfig.rows;
		cols = dataConfig.cols;
	});

	describe(`getCol`, () => {
		it(`gets a single column`, () => {
			const names = rows.getCol(cols.NAME);
			expect(names).toEqual(['Auckland', 'Taupō', 'Hamburg', 'Sydney', 'Hamilton', 'Wellington', 'Christchurch', 'Dunedin', 'Tauranga']);
		});

		it(`throws an error if the column does not exist`, () => {
			expect(() => rows.getCol()).toThrowError();
			expect(() => rows.getCol(-1)).toThrowError();
			expect(() => rows.getCol(1000)).toThrowError();
		});
	});

	describe(`addCol`, () => {
		it(`adds an array of the right length as a new column`, () => {
			const pop = rows.getCol(cols.POPULATION);
			const popTrue = pop.map((pop) => pop * 1000);

			cols.POPULATION_TRUE = rows.addCol(popTrue);
			expect(cols.POPULATION_TRUE).toBe(7);

			const popTrueInRows = rows.getCol(cols.POPULATION_TRUE);
			expect(popTrueInRows).toEqual(popTrue);
		});

		it(`throws an error if a column of the wrong length is passed`, () => {
			const shortCol = [1, 2, 3];

			expect(() => cols.SHORT = rows.addCol(shortCol)).toThrowError();
		});

		it(`accepts a function to create a new derived column based on the row`, () => {
			const getTruePop = (row) => row[cols.POPULATION] * 1000;

			cols.POPULATION_TRUE = rows.addCol(getTruePop);
			expect(cols.POPULATION_TRUE).toBe(7);

			const popTrueFromMap = rows.getCol(cols.POPULATION).map((pop) => pop * 1000);
			const popTrueInRows = rows.getCol(cols.POPULATION_TRUE);
			expect(popTrueInRows).toEqual(popTrueFromMap);

			const getIndex = (row, i) => i;
			cols.INDEX = rows.addCol(getIndex);
			expect(cols.INDEX).toBe(8);

			const indexCol = rows.getCol(cols.INDEX);
			const indexFromMap = rows.map((row, i) => i);
			expect(indexCol).toEqual(indexFromMap);
		});
	});
});

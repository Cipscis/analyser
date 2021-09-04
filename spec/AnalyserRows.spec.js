import * as analyser from '../dist/analyser.js';

import { fetch } from './mocks/fetch.mock.js';
global.fetch = fetch;

import { exampleAConfig, exampleBConfig, exampleCConfig } from
'./data/example.config.js';

describe(`AnalyserRows`, () => {
	describe(`getCol`, () => {
		it(`gets a single column`, async () => {
			const { rows, cols } = await analyser.loadFile(exampleAConfig);

			const names = rows.getCol(cols.NAME);
			expect(names).toEqual(['Auckland', 'Taupō', 'Hamburg', 'Sydney', 'Hamilton', 'Wellington', 'Christchurch', 'Dunedin', 'Tauranga']);
		});

		it(`throws an error if the column does not exist`, async () => {
			const { rows, cols } = await analyser.loadFile(exampleAConfig);

			expect(() => rows.getCol()).toThrowError();
			expect(() => rows.getCol(-1)).toThrowError();
			expect(() => rows.getCol(1000)).toThrowError();
		});
	});
});

import * as analyser from '../dist/analyser.js';
import * as statistics from '../dist/statistics.js';

import { AnalyserGroup } from '../dist/AnalyserGroup.js';

import { fetch } from './mocks/fetch.mock.js';
global.fetch = fetch;

import { exampleAConfig, exampleBConfig, exampleCConfig } from
'./data/example.config.js';

describe(`AnalyserGroup`, () => {
	let rows;
	let cols;
	let group;

	beforeEach(async () => {
		const dataConfig = await analyser.loadFile(exampleAConfig);
		rows = dataConfig.rows;
		cols = dataConfig.cols;
		group = dataConfig.group;
	});

	it(`can be created by using the 'group' function`, () => {
		const countryGroup = group(rows, cols.COUNTRY);

		expect(countryGroup).toBeInstanceOf(AnalyserGroup);
	});

	it(`can be summarised`, () => {
		const countryGroup = group(rows, cols.COUNTRY);

		const summary = countryGroup.summarise({
			number: (rows) => rows.length,
			mean_population: (rows) => statistics.mean(rows.getCol(cols.POPULATION)),
			max_population: (rows) => statistics.max(rows.getCol(cols.POPULATION)),
		});

		console.table(summary);
		// TODO: Implement test
		throw new Error('Test not implemented');
	});
});

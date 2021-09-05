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

	it(`respects aliases when grouping by discrete string values`, () => {
		const countryGroup = group(rows, cols.COUNTRY);

		expect(countryGroup.has('New Zealand')).toBe(true);
		expect(countryGroup.has('Aoteator')).toBe(false);
	});

	it(`checks every value in an array when determining which groups a row belongs to`, () => {
		const publicTransportGroup = group(rows, cols.PUBLIC_TRANSPORT);

		expect(publicTransportGroup.get('Bus').length).toBe(9);
		expect(publicTransportGroup.get('Train').length).toBe(5);
		expect(publicTransportGroup.get('Ferry').length).toBe(3);
		expect(publicTransportGroup.get('Cable Car').length).toBe(1);
	});

	it(`can be summarised`, () => {
		const countryGroup = group(rows, cols.COUNTRY);

		const summary = countryGroup.summarise({
			number: (rows) => rows.length,
			mean_population: (rows) => statistics.mean(rows.getCol(cols.POPULATION)),
			max_population: (rows) => statistics.max(rows.getCol(cols.POPULATION)),
		});

		expect(summary).toEqual([
			['', 'number', 'mean_population', 'max_population'],
			['New Zealand', 7, 396.94542857142864, 1614],
			['Germany', 1, 1810, 1810],
			['Australia', 1, 4841, 4841],
		]);
	});
});

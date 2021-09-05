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

	it(`can group rows by splitting continuous data into a specified number of bands`, () => {
		const populationGroup = group(rows, cols.POPULATION, 5);

		const groupArr = [];
		for (let [groupName, rows] of populationGroup) {
			groupArr.push(rows);
		}

		expect(groupArr.length).toBe(5);
		expect(groupArr[0].length).toBe(5);
		expect(groupArr[1].length).toBe(2);
		expect(groupArr[2].length).toBe(0);
		expect(groupArr[3].length).toBe(0);
		expect(groupArr[4].length).toBe(1);
	});

	it(`can group rows by splitting continuous data at specified points`, () => {
		const populationGroup = group(rows, cols.POPULATION, [300, 1000]);

		const groupArr = [];
		for (let [groupName, rows] of populationGroup) {
			groupArr.push(rows);
		}

		expect(groupArr.length).toBe(3);
		expect(groupArr[0].length).toBe(4);
		expect(groupArr[1].length).toBe(2);
		expect(groupArr[2].length).toBe(3);
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

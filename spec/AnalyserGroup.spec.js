import * as analyser from '../dist/new/index.js';
import * as statistics from '../dist/statistics.js';

import { DataGroup } from '../dist/new/DataGroup.js';

import { fetch } from './mocks/fetch.mock.js';
global.fetch = fetch;

import { exampleAConfig, exampleBConfig, exampleCConfig } from
'./data/example.config.js';

describe(`AnalyserGroup`, () => {
	let rows;

	beforeEach(async () => {
		const dataConfig = await analyser.loadFile(exampleAConfig);
		rows = dataConfig.rows;
	});

	it(`can be created by using the 'groupBy' function`, () => {
		const countryGroup = rows.groupBy('COUNTRY');

		expect(countryGroup).toBeInstanceOf(DataGroup);
	});

	it(`respects aliases when grouping by discrete string values`, () => {
		const countryGroup = rows.groupBy('COUNTRY');

		expect(countryGroup.has('New Zealand')).toBe(true);
		expect(countryGroup.has('Aoteatora')).toBe(false);
	});

	it(`checks every value in an array when determining which groups a row belongs to`, () => {
		const publicTransportGroup = rows.groupBy('PUBLIC_TRANSPORT');

		expect(publicTransportGroup.get('Bus').length).toBe(9);
		expect(publicTransportGroup.get('Train').length).toBe(5);
		expect(publicTransportGroup.get('Ferry').length).toBe(3);
		expect(publicTransportGroup.get('Cable Car').length).toBe(1);
	});

	it(`can group rows by splitting continuous data into a specified number of bands`, () => {
		const populationGroup = rows.groupBy('POPULATION', 5);

		const groupArr = [];
		for (let [groupName, rows] of populationGroup) {
			groupArr.push(rows);
		}

		expect(groupArr.length).toBe(5);
		expect(groupArr[0].length).toBe(6);
		expect(groupArr[1].length).toBe(2);
		expect(groupArr[2].length).toBe(0);
		expect(groupArr[3].length).toBe(0);
		expect(groupArr[4].length).toBe(1);
	});

	it(`can group rows by splitting continuous data at specified points`, () => {
		const populationGroup = rows.groupBy('POPULATION', [300, 1000]);

		const groupArr = [];
		for (let [groupName, rows] of populationGroup) {
			groupArr.push(rows);
		}

		expect(groupArr.length).toBe(3);
		expect(groupArr[0].length).toBe(4);
		expect(groupArr[1].length).toBe(2);
		expect(groupArr[2].length).toBe(3);
	});

	it(`respects the 'right' argument when splitting continuous data`, () => {
		const populationGroupRight = rows.groupBy('POPULATION', [300, 1810], true);
		const populationGroupLeft = rows.groupBy('POPULATION', [300, 1810], false);

		expect(populationGroupRight.get('300 < x <= 1810').length).toBe(4);
		expect(populationGroupLeft.get('300 <= x < 1810').length).toBe(3);

	});

	it(`can split continuous data into two groups by specifying a single value`, () => {
		const populationSplit = rows.groupBy('POPULATION', [1000]);

		expect(populationSplit.get('x <= 1000').length).toBe(6);
		expect(populationSplit.get('1000 < x').length).toBe(3);
	});

	it(`can split continuous data into two groups by specifying the number 2`, () => {
		const populationSplit = rows.groupBy('POPULATION', 2);

		const splitArr = [];
		for (let [groupName, rows] of populationSplit) {
			splitArr.push(rows);
		}

		expect(splitArr.length).toBe(2);
		expect(splitArr[0].length).toBe(8);
		expect(splitArr[1].length).toBe(1);
	});

	it(`throws an error if attempting to split into an invalid number of groups`, () => {
		expect(() => rows.groupBy('POPULATION', 'test')).toThrowError();
		expect(() => rows.groupBy('POPULATION', 1.2)).toThrowError();
		expect(() => rows.groupBy('POPULATION', 1)).toThrowError();
		expect(() => rows.groupBy('POPULATION', -1)).toThrowError();
		expect(() => rows.groupBy('POPULATION', ['a'])).toThrowError();
		expect(() => rows.groupBy('POPULATION', [])).toThrowError();
	});

	it(`can be summarised`, () => {
		const countryGroup = rows.groupBy('COUNTRY');

		const summary = countryGroup.summarise({
			number: (rows) => rows.length,
			mean_population: (rows) => statistics.mean(rows.map(({ POPULATION}) => POPULATION)),
			max_population: (rows) => Math.max(...rows.map(({ POPULATION }) => POPULATION)),
			name: (rows, name) => name,
		});

		// Summaries of discrete values are sorted
		expect(summary).toEqual([
			['Value', 'number', 'mean_population', 'max_population', 'name'],
			['Australia', 1, 4841, 4841, 'Australia'],
			['Germany', 1, 1810, 1810, 'Germany'],
			['New Zealand', 7, 396.94542857142864, 1614, 'New Zealand'],
		]);
	});

	it(`Uses a default "Count" summariser if none are specified`, () => {
		const countryGroup = rows.groupBy('COUNTRY');

		const summary = countryGroup.summarise();

		expect(summary).toEqual([
			['Value', 'Count'],
			['Australia', 1],
			['Germany', 1],
			['New Zealand', 7],
		]);
	});
});

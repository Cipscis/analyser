import * as analyser from '../dist/new/index.js';
import * as statistics from '../dist/statistics.js';

import { fetch } from './mocks/fetch.mock.js';
global.fetch = fetch;

import { exampleAConfig } from
'./data/example.config.js';

import { getChartData } from '../dist/charts/ChartData.js';

import { Scale } from '../dist/charts/Scale.js';

describe(`Scale`, () => {
	// Suppress console warnings during tests
	beforeAll(() => {
		spyOn(console, 'warn');
	});

	let rows;
	let summary;

	beforeEach(async () => {
		const dataConfig = await analyser.loadFile(exampleAConfig);
		rows = dataConfig.rows;

		summary = rows.groupBy('NAME').summarise({
			population: (rows) => statistics.sum(rows.map(({ POPULATION }) => POPULATION)),
			pop_half: (rows) => statistics.sum(rows.map(({ POPULATION }) => POPULATION) / 2),
		});
	});

	it(`can be created by using the a ScaleOptions object`, () => {
		const scaleOptions = {
			min: 1,
			max: 11,
		};
		const scale = new Scale(scaleOptions);

		expect(scale.min).toBe(scaleOptions.min);
		expect(scale.max).toBe(scaleOptions.max);
	});

	it(`lets you read its width`, () => {
		const scaleOptions = {
			min: 1,
			max: 11,
		};
		const scale = new Scale(scaleOptions);

		expect(scale.width).toBe(scaleOptions.max - scaleOptions.min);
	});

	it(`ensures min and max are around the right way`, () => {
		const scaleOptions = {
			min: 11,
			max: 1,
		};
		const scale = new Scale(scaleOptions);

		expect(scale.min).toBe(scaleOptions.max);
		expect(scale.max).toBe(scaleOptions.min);
		expect(scale.width).toBe(scaleOptions.min - scaleOptions.max);
	});

	it(`can determine min and max from ChartData`, () => {
		const chartData = getChartData(summary);

		const scale = new Scale(chartData);

		expect(scale.min).toBe(16.4535);
		expect(scale.max).toBe(4841);
	});

	it(`can have data min and max overridden by AxisOptions from ChartOptions for a y axis`, () => {
		const chartData = getChartData(summary);

		const axisOptions = {
			min: -10,
			max: 10000,
		};
		const chartOptions = {
			y: axisOptions,
		};

		const scale = new Scale(chartData, chartOptions, 'y');

		expect(scale.min).toBe(axisOptions.min);
		expect(scale.max).toBe(axisOptions.max);
	});

	it(`can determine min and max from string ChartData labels for an x axis`, () => {
		const numberSummary = [
			[, 'Group 1', 'Group 2'],
			['1', 2, 3],
			['4', 5, 6],
			['7', 8, 9],
		];

		const chartData = getChartData(numberSummary);

		const axisOptions = {};
		const chartOptions = {
			x: axisOptions,
		};

		const scale = new Scale(chartData, chartOptions, 'x');

		expect(scale.min).toBe(1);
		expect(scale.max).toBe(7);
	});

	it(`can determine min and max from number ChartData labels for an x axis`, () => {
		const numberSummary = [
			[, 'Group 1', 'Group 2'],
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
		];

		const chartData = getChartData(numberSummary);

		const axisOptions = {};
		const chartOptions = {
			x: axisOptions,
		};

		const scale = new Scale(chartData, chartOptions, 'x');

		expect(scale.min).toBe(1);
		expect(scale.max).toBe(7);
	});

	it(`can determine min and max from Date ChartData labels for an x axis`, () => {
		const numberSummary = [
			[, 'Group 1', 'Group 2'],
			[new Date(2000, 1, 1), 2, 3],
			[new Date(2010, 1, 1), 5, 6],
			[new Date(2020, 1, 1), 8, 9],
		];

		const chartData = getChartData(numberSummary);

		const axisOptions = {};
		const chartOptions = {
			x: axisOptions,
		};

		const scale = new Scale(chartData, chartOptions, 'x');

		expect(scale.min).toBe(+(new Date(2000, 1, 1)));
		expect(scale.max).toBe(+(new Date(2020, 1, 1)));
	});

	it(`can have data min and max overridden by AxisOptions from ChartOptions for an x axis`, () => {
		const numberSummary = [
			[, 'Group 1', 'Group 2'],
			['1', 2, 3],
			['4', 5, 6],
			['7', 8, 9],
		];

		const chartData = getChartData(numberSummary);

		const axisOptions = {
			min: -1,
			max: 10,
		};
		const chartOptions = {
			x: axisOptions,
		};

		const scale = new Scale(chartData, chartOptions, 'x');

		expect(scale.min).toBe(axisOptions.min);
		expect(scale.max).toBe(axisOptions.max);
	});

	it(`throws an error if trying to determine min and max from ChartData labels for an x axis where labels are not numbers`, () => {
		const numberSummary = [
			[, 'Group 1', 'Group 2'],
			['a', 2, 3],
			['b', 5, 6],
			['c', 8, 9],
		];

		const chartData = getChartData(numberSummary);

		const axisOptions = {
			min: -1,
			max: 10,
		};
		const chartOptions = {
			x: axisOptions,
		};

		expect(() => new Scale(chartData, chartOptions, 'x')).toThrowError();
	});

	it(`can automatically determine min from AxisOptions from ChartOptions`, () => {

		const axisOptions = {
			min: 'auto',
		};
		const chartOptions = {
			y: axisOptions,
		};

		const chartData = getChartData(summary, chartOptions);

		const scale = new Scale(chartData, chartOptions, 'y');

		expect(scale.min).toBe(0);
	});

	it(`can automatically determine max from AxisOptions from ChartOptions`, () => {

		const axisOptions = {
			max: 'auto',
			min: 0,
		};
		const chartOptions = {
			y: axisOptions,
		};

		const chartData = getChartData(summary, chartOptions);

		const scale = new Scale(chartData, chartOptions, 'y');

		expect(scale.max).toBe(5000);
	});

	it(`can automatically determine max from AxisOptions from ChartOptions for a stacked chart`, () => {

		const axisOptions = {
			max: 'auto',
			min: 0,
		};
		const chartOptions = {
			y: axisOptions,
			stacked: true,
		};

		const chartData = getChartData(summary, chartOptions);

		const scale = new Scale(chartData, chartOptions, 'y');

		expect(scale.max).toBe(8000);
	});

	it(`can get the correct proportion for a given value on the scale`, () => {
		const scaleOptions = {
			min: 0,
			max: 100,
		};
		const scale = new Scale(scaleOptions);

		const input = [0, 0.1, -3, Math.PI, 100];
		const output = input.map((el) => el / 100);

		for (let i = 0; i < input.length; i++) {
			expect(scale.getProportion(input[i])).toBe(output[i]);
		}
	});

	it(`can get the correct value on the scale for a given proportion`, () => {
		const scaleOptions = {
			min: 0,
			max: 100,
		};
		const scale = new Scale(scaleOptions);

		const input = [0, 0.1, -3, Math.PI, 100];
		const output = input.map((el) => el * 100);

		for (let i = 0; i < input.length; i++) {
			expect(scale.getValue(input[i])).toBe(output[i]);
		}
	});

	it(`can create a series of evenly spaced numbers across the width of the scale of a given length`, () => {
		const scaleOptions = {
			min: 0,
			max: 100,
		};
		const scale = new Scale(scaleOptions);

		const series = scale.getSeries(5);

		expect(series).toEqual([0, 25, 50, 75, 100]);
	});
});

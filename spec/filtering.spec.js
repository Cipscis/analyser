import * as analyser from '../dist/analyser.js';
import { AnalyserRows } from '../dist/AnalyserRows.js';

import { fetch } from './mocks/fetch.mock.js';
global.fetch = fetch;

import { exampleAConfig, exampleBConfig, exampleCConfig } from
'./data/example.config.js';

describe(`filtering`, () => {
	// Suppress console warnings during tests
	let consoleWarnSpy;
	beforeEach(() => {
		consoleWarnSpy = spyOn(console, 'warn');
	});

	let rows;
	let cols;
	let by;

	beforeEach(async () => {
		const dataConfig = await analyser.loadFile(exampleAConfig);
		rows = dataConfig.rows;
		cols = dataConfig.cols;
		by = dataConfig.by;
	});

	it(`lets you use the 'by' function`, () => {
		const filteredRows = rows.filter(by(cols.NAME, 'Auckland'));

		expect(filteredRows.length).toBe(1);
		expect(filteredRows[0][cols.NAME]).toBe('Auckland');
	});

	it(`lets you filter by an array of values`, () => {
		const filteredRows = rows.filter(by(cols.NAME, ['Taupō', 'Hamburg']));

		expect(filteredRows.length).toBe(2);
		expect(filteredRows[0][cols.NAME]).toBe('Taupō');
		expect(filteredRows[1][cols.NAME]).toBe('Hamburg');
	});

	it(`lets you filter by a function`, () => {
		const filteredRows = rows.filter(by(cols.POPULATION, (pop) => pop > 1000));

		expect(filteredRows.length).toBe(3);
		expect(filteredRows[0][cols.NAME]).toBe('Auckland');
		expect(filteredRows[1][cols.NAME]).toBe('Hamburg');
		expect(filteredRows[2][cols.NAME]).toBe('Sydney');
	});

	it(`respects aliases`, () => {
		const filteredRows = rows.filter(by(cols.COUNTRY, 'Aotearoa'));

		expect(filteredRows.length).toBe(7);
	});

	it(`respects aliases when filtering by an array of values`, () => {
		const filteredRows = rows.filter(by(cols.COUNTRY, ['Australia', 'Aotearoa']));

		expect(filteredRows.length).toBe(8);
	});

	it(`lets you build an AND filter using 'andBy'`, () => {
		const filteredRows = rows.filter(
			by(cols.POPULATION, (pop) => pop > 300)
			.andBy(cols.COUNTRY, 'New Zealand')
		);

		expect(filteredRows.length).toBe(3);
		expect(filteredRows[0][cols.NAME]).toBe('Auckland');
		expect(filteredRows[1][cols.NAME]).toBe('Wellington');
		expect(filteredRows[2][cols.NAME]).toBe('Christchurch');
	});

	it(`lets you build an OR filter using 'orBy'`, () => {
		const filteredRows = rows.filter(
			by(cols.POPULATION, (pop) => pop < 150)
			.orBy(cols.COUNTRY, 'Germany')
		);

		expect(filteredRows.length).toBe(4);
		expect(filteredRows[0][cols.NAME]).toBe('Taupō');
		expect(filteredRows[1][cols.NAME]).toBe('Hamburg');
		expect(filteredRows[2][cols.NAME]).toBe('Dunedin');
		expect(filteredRows[3][cols.NAME]).toBe('Tauranga');
	});

	it(`lets you build a complex filter using both 'orBy' and 'andBy'`, () => {
		const filteredRows = rows.filter(
			by(cols.POPULATION, (pop) => pop < 150)
			.andBy(cols.COUNTRY, 'New Zealand')
			.orBy(cols.COUNTRY, 'Germany')
		);

		expect(filteredRows.length).toBe(4);
		expect(filteredRows[0][cols.NAME]).toBe('Taupō');
		expect(filteredRows[1][cols.NAME]).toBe('Hamburg');
		expect(filteredRows[2][cols.NAME]).toBe('Dunedin');
		expect(filteredRows[3][cols.NAME]).toBe('Tauranga');
	});

	it(`returns an AnalyserRows when using the filter method`, () => {
		const filteredRows = rows.filter(by(cols.COUNTRY, 'New Zealand'));

		expect(filteredRows).toBeInstanceOf(AnalyserRows);
	});

	it(`returns an empty AnalyserRows if nothing matches the filter`, () => {
		const filteredRows = rows.filter(by(cols.COUNTRY, 'COLOMBIA'));

		expect(filteredRows.length).toBe(0);
	});
});

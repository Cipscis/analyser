import * as analyser from '../dist/index.js';
import { Data } from '../dist/Data.js';

import { fetch } from './mocks/fetch.mock.js';
global.fetch = fetch;

import { exampleAConfig, exampleBConfig, exampleCConfig } from
'./data/example.config.js';

describe(`filtering`, () => {
	let rows;
	const aliases = exampleAConfig.aliases;

	beforeEach(async () => {
		rows = await analyser.loadFile(exampleAConfig);
	});

	it(`lets you use the 'matchWithAlias' function`, () => {
		const filteredRows = rows.filter(({ name }) => analyser.matchWithAlias(name, 'Auckland', aliases));

		expect(filteredRows.length).toBe(1);
		expect(filteredRows[0].name).toBe('Auckland');
	});

	it(`lets you filter by an array of values`, () => {
		const filteredRows = rows.filter(({ name }) => analyser.matchWithAlias(name, ['Taupō', 'Hamburg'], aliases));

		expect(filteredRows.length).toBe(2);
		expect(filteredRows[0].name).toBe('Taupō');
		expect(filteredRows[1].name).toBe('Hamburg');
	});

	it(`lets you filter by a function`, () => {
		const filteredRows = rows.filter(({ population }) => population > 1000);

		expect(filteredRows.length).toBe(3);
		expect(filteredRows[0].name).toBe('Auckland');
		expect(filteredRows[1].name).toBe('Hamburg');
		expect(filteredRows[2].name).toBe('Sydney');
	});

	it(`respects aliases`, () => {
		const filteredRows = rows.filter(({ country }) => analyser.matchWithAlias(country,  'Aotearoa', aliases));

		expect(filteredRows.length).toBe(7);
	});

	it(`respects aliases when filtering by an array of values`, () => {
		const filteredRows = rows.filter(({ country }) => analyser.matchWithAlias(country, ['Australia', 'Aotearoa'], aliases));

		expect(filteredRows.length).toBe(8);
	});

	it(`returns an Data when using the filter method`, () => {
		const filteredRows = rows.filter(({ country }) => analyser.matchWithAlias(country, 'New Zealand', aliases));

		expect(filteredRows).toBeInstanceOf(Data);
	});

	it(`returns an empty Data if nothing matches the filter`, () => {
		const filteredRows = rows.filter(({ country }) => analyser.matchWithAlias(country, 'COLOMBIA', aliases));

		expect(filteredRows.length).toBe(0);
	});
});

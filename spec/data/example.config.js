// import { transformers } from '../../dist/analyser.js';
import {
	types,
	fileConfig,
} from '../../dist/new/index.js';

const exampleAConfig = fileConfig({
	path: 'city example.csv',
	cols: {
		name: ['A', types.string],
		country: ['B', types.string],
		population: ['C', types.number],
		capital: ['D', types.booleanCustom('true', /^('No'|false|)$/)],
		publicTransport: ['E', types.array(',')],
		mayor2012: ['F', types.string],
		mayor2018: ['G', types.string],
	},
	aliases: [
		['New Zealand', 'Aotearoa'],
	],
	headerRows: 1,
});

const exampleBConfig = {
	path: 'city example 2.csv',
	cols: {
		name: ['A', types.string],
		country: ['B', types.string],
		population: ['C', types.number],
	},
	headerRows: 1,
};

const exampleCConfig = {
	path: 'city example 3.csv',
	cols: {
		year: ['A', types.string],
		population: ['B', types.number],
	},
	headerRows: 1,
};

export {
	exampleAConfig,
	exampleBConfig,
	exampleCConfig,
};
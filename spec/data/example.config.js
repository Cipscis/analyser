// import { transformers } from '../../dist/analyser.js';
import {
	types,
	fileConfig,
} from '../../dist/new/index.js';

const exampleAConfig = fileConfig({
	path: 'city example.csv',
	cols: {
		NAME: ['A', types.string],
		COUNTRY: ['B', types.string],
		POPULATION: ['C', types.number],
		CAPITAL: ['D', types.booleanCustom('true', /^('No'|false|)$/)],
		PUBLIC_TRANSPORT: ['E', types.array(',')],
		MAYOR_2012: ['F', types.string],
		MAYOR_2018: ['G', types.string],
	},
	aliases: [
		['New Zealand', 'Aotearoa'],
	],
	headerRows: 1,
});

const exampleBConfig = {
	path: 'city example 2.csv',
	cols: {
		NAME: ['A', types.string],
		COUNTRY: ['B', types.string],
		POPULATION: ['C', types.number],
	},
	headerRows: 1,
};

const exampleCConfig = {
	path: 'city example 3.csv',
	cols: {
		YEAR: ['A', types.string],
		POPULATION: ['B', types.number],
	},
	headerRows: 1,
};

export {
	exampleAConfig,
	exampleBConfig,
	exampleCConfig,
};
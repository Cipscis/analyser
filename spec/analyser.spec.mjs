import { loadFile, getColNumbers } from '../analyser.js';

import { fetch } from './mocks/fetch.mock.mjs';
global.fetch = fetch;

describe('loadFile', () => {
	it('loads a file', async () => {
		let fileConfig = {
			path: 'city example.csv',
			headerRows: 1,
			cols: getColNumbers({
				NAME: 'A',
				COUNTRY: 'B',
				POPULATION: 'C',
				CAPITAL: 'D',
				PUBLIC_TRANSPORT: 'E',
				MAYOR_2012: 'F',
				MAYOR_2018: 'G',
			}),
			arrayCols: {},
			aliases: {
				COUNTRY: [
					['New Zealand', 'Aotearoa']
				]
			},
			enumsMap: {}
		};
		fileConfig.arrayCols[fileConfig.cols.PUBLIC_TRANSPORT] = ',';
		fileConfig.arrayCols[fileConfig.cols.MAYOR_2018] = ',';

		let data = await loadFile(fileConfig);

		console.log(data);
	});
});

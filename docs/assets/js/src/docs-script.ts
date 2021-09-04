import * as analyser from '@cipscis/analyser';
// import * as analyser from '../../../../src/analyser.js';

const stringToBool = (value: string): boolean | null => {
	switch (value.trim().toLowerCase()) {
		case 'true':
			return true;
		case `'no'`:
		case '':
			return false;
		default:
			return null;
	}
};

const analyse = async function () {
	const fileInfoA: analyser.FileConfig = {
		path: '/analyser/assets/data/city example.csv',
		headerRows: 1,
		cols: {
			NAME: 'A',
			COUNTRY: 'B',
			POPULATION: 'C',
			CAPITAL: 'D',
			PUBLIC_TRANSPORT: 'E',
			MAYOR_2012: 'F',
			MAYOR_2018: 'G',
		},
		transform: {
			POPULATION: analyser.transformers.number,
			CAPITAL: stringToBool,
			PUBLIC_TRANSPORT: analyser.transformers.array(','),
			MAYOR_2018: analyser.transformers.array(','),
		},
		aliases: {
			'COUNTRY': [
				['New Zealand', 'Aotearoa']
			],
		},
	};

	const fileInfoB: analyser.FileConfig = {
		path: '/analyser/assets/data/city example 2.csv',
		headerRows: 1,
		cols: analyser.getColNumbers({
			NAME: 'A',
			COUNTRY: 'B',
			POPULATION: 'C',
		}),
	};
	const fileInfoC = {
		path: '/analyser/assets/data/city example 3.csv',
		headerRows: 1,
		cols: analyser.getColNumbers({
			YEAR: 'A',
			POPULATION: 'B',
		}),
	};

	const [cityData, cityData2, cityData3] = await analyser.loadFile(fileInfoA, fileInfoB, fileInfoC);

	const cityDataA = await analyser.loadFile(fileInfoA);

	// console.log(cityData.rows);
	// console.log(cityData.rows[0]);

	// console.log(cityData2.rows);
	// console.log(cityData2.rows[0]);

	// console.log(cityData3.rows);
	// console.log(cityData3.rows[0]);

	const {
		rows,
		cols,
		by,
		group,
	} = cityData;

	console.log(rows);
	console.log(cols);

	console.log(rows.filter(
		by(cols.POPULATION, (pop: number) => pop > 1000)
		.orBy(cols.POPULATION, (pop: number) => pop < 300)
		.andBy(cols.MAYOR_2012, 'Len Brown')
	));

	const getIndex = (row: any[], i: number): number => i;
	cols.INDEX = rows.addCol(getIndex);

	console.table(group(rows, cols.COUNTRY).summarise({
		number: (rows) => rows.length,
	}));
};

analyse();

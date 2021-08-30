// import * as analyser from '@cipscis/analyser';
import * as analyser from '../../../../src/analyser';

const analyse = async function () {
	const fileInfoA: analyser.FileConfig = {
		path: '/analyser/assets/data/city example.csv',
		headerRows: 1,
		cols: analyser.getColNumbers({
			NAME: 'A',
			COUNTRY: 'B',
			POPULATION: 'C',
			CAPITAL: 'D',
			PUBLIC_TRANSPORT: 'E',
			MAYOR_2012: 'F',
			MAYOR_2018: 'G',
		}),
		// arrayCols: {},
		aliases: {
			'COUNTRY': [
				['New Zealand', 'Aotearoa']
			],
		},
		// aliases: {
		// 	COUNTRY: [
		// 		['New Zealand', 'Aotearoa']
		// 	]
		// },
		// enumsMap: {},
	};
	// fileInfoA.arrayCols[fileInfoA.cols.PUBLIC_TRANSPORT] = ',';
	// fileInfoA.arrayCols[fileInfoA.cols.MAYOR_2018] = ',';

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
	} = cityData;

	console.log(rows);
	console.log(cols);

	console.log(rows.filter(
		by(cols.POPULATION, (pop: number) => pop > 1000)
		.orBy(cols.POPULATION, (pop: number) => pop < 300)
		.andBy(cols.MAYOR_2012, 'Len Brown')
	));
};

analyse();

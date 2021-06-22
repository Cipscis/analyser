import * as analyser from '/analyser.js';

const analyse = async function () {
	let fileInfoA = {
		path: '/analyser/assets/data/city example.csv',
		headerRows: 1,
		cols: {
			NAME: analyser.getColNumber('A'),
			COUNTRY: analyser.getColNumber('B'),
			POPULATION: analyser.getColNumber('C'),
			CAPITAL: analyser.getColNumber('D'),
			PUBLIC_TRANSPORT: analyser.getColNumber('E'),
			MAYOR_2012: analyser.getColNumber('F'),
			MAYOR_2018: analyser.getColNumber('G')
		},
		arrayCols: {},
		aliases: {
			COUNTRY: [
				['New Zealand', 'Aotearoa']
			]
		},
		enumsMap: {},
	};
	fileInfoA.arrayCols[fileInfoA.cols.PUBLIC_TRANSPORT] = ',';
	fileInfoA.arrayCols[fileInfoA.cols.MAYOR_2018] = ',';

	let fileInfoB = {
		path: '/analyser/assets/data/city example 2.csv',
		headerRows: 1,
		cols: {
			NAME: analyser.getColNumber('A'),
			COUNTRY: analyser.getColNumber('B'),
			POPULATION: analyser.getColNumber('C')
		}
	};
	let fileInfoC = {
		path: '/analyser/assets/data/city example 3.csv',
		headerRows: 1,
		cols: {
			YEAR: analyser.getColNumber('A'),
			POPULATION: analyser.getColNumber('B')
		}
	};

	let [cityData, cityData2, cityData3] = await analyser.loadFile(fileInfoA, fileInfoB, fileInfoC);

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
		by(cols.POPULATION, pop => pop > 1000)
		.andBy(cols.PUBLIC_TRANSPORT, 'Train')
		.orBy(cols.PUBLIC_TRANSPORT, 'Bus')
	));
};

analyse();

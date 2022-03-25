// import * as analyser from '@cipscis/analyser';
import { sum } from '../../../../dist/statistics.js';
import * as analyser from '../../../../src/analyser.js';

const analyse = async function () {
	const fileInfoA = analyser.fileConfig({
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
			CAPITAL: analyser.transformers.booleanCustom('true', /^$|^'no'$/i),
			PUBLIC_TRANSPORT: analyser.transformers.array(','),
			MAYOR_2018: analyser.transformers.array(','),
		},
		aliases: [
			['New Zealand', 'Aotearoa']
		],
	});

	const fileInfoB = analyser.fileConfig({
		path: '/analyser/assets/data/city example 2.csv',
		headerRows: 1,
		cols: {
			NAME: 'A',
			COUNTRY: 'B',
			POPULATION: 'C',
		},
	});
	const fileInfoC = analyser.fileConfig({
		path: '/analyser/assets/data/city example 3.csv',
		headerRows: 1,
		cols: {
			YEAR: 'A',
			POPULATION: 'B',
		},
	});

	const [cityData, cityData2, cityData3] = await Promise.all([
		analyser.loadFile(fileInfoA),
		analyser.loadFile(fileInfoB),
		analyser.loadFile(fileInfoC),
	]);

	const {
		rows,
		cols,
		addedCols,
		by,
		group,
	} = cityData;

	// console.log(rows);
	// console.log(cols);

	// console.log(rows.filter(
	// 	by(cols.POPULATION, (pop: number) => pop > 1000)
	// 	.orBy(cols.POPULATION, (pop: number) => pop < 300)
	// 	.andBy(cols.MAYOR_2012, 'Len Brown')
	// ));

	const getIndex = (row: any[], i: number): number => i;

	addedCols.INDEX = rows.addCol(getIndex);
	// console.log(addedCols.INDEX);

	// console.dir(group(rows, cols.COUNTRY));

	// console.table(group(rows, cols.COUNTRY).summarise({
	// 	number: (rows) => rows.length,
	// }));

	// console.table(group(rows, cols.PUBLIC_TRANSPORT).summarise({
	// 	number: (rows) => rows.length,
	// }));

	const nameGroup = group(rows, cols.NAME);
	const nameGroupSummary = nameGroup.summarise({
		population: (rows) => sum(rows.getCol(cols.POPULATION) as number[]),
		pop_half: (rows) => sum(rows.getCol(cols.POPULATION) as number[]) / 2,
	});
	const barChartHtml = analyser.bar(nameGroupSummary,
	{
		title: 'Bar Chart',
		legend: true,

		colours: {
			population: 'blue',
			pop_half: 'red',
		},

		y: {
			title: 'population',
			values: 8,
			// values: [0, 1000, 6000],
			// gridlines: [0, 1000, 6000],
			// gridlines: [],
			gridlines: 4,

			numberFormat: new Intl.NumberFormat('en-NZ', {
				useGrouping: true,
				maximumFractionDigits: 0,
			}),
			// numberFormat: (value: number) => value.toFixed(2),

			// max: 'auto',
			// min: 'auto',
			// max: 6500,
			// min: -1000,
		},
		x: {
			title: 'City',
			labels: ['Sydney', 'Hamburg', 'Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Nothing', 0],
			numberFormat: (value: number) => value.toFixed(2),
		},

		stacked: true,
	});

	const $barChart = document.getElementById('bar-chart');
	if ($barChart) {
		$barChart.innerHTML = barChartHtml;
	}

	const lineChartHtml = analyser.line(
		[
			[, 'Line 1', 'Line 2'],
			[new Date(2022, 2, 1), 0, 50],
			[new Date(2022, 2, 2), 10, 40],
			[new Date(2022, 2, 4), 25, 20],
			[new Date(2022, 2, 5), 50, 15],
			[new Date(2022, 2, 6), 30, 30],

			// [1, 0, 50],
			// [2, 10, 40],
			// [3, 25, 20],
			// [4, 50, 15],
			// [5, 30, 30],
		],
		{
			title: 'Line Chart',
			legend: true,

			colours: {
				'Line 1': 'blue',
				// 'Line 2': 'red',
			},

			y: {
				title: 'y axis',
				values: 5,

				numberFormat: new Intl.NumberFormat('en-NZ', {
					useGrouping: true,
					maximumFractionDigits: 0,
				}),
			},

			x: {
				title: 'x axis',
				// values: 5,
				values: [
					new Date(2022, 2, 1),
					new Date(2022, 2, 2),
					new Date(2022, 2, 4),
					new Date(2022, 2, 5),
					new Date(2022, 2, 6),
				],
				// values: [0, 2, 4, 6],

				gridlines: 5,
				// gridlines: [
				// 	new Date(2022, 2, 1),
				// 	new Date(2022, 2, 2),
				// 	new Date(2022, 2, 3),
				// 	new Date(2022, 2, 4),
				// 	new Date(2022, 2, 5),
				// 	new Date(2022, 2, 6),
				// ],
				// gridlines: [1, 4],

				// numberFormat: (value: number) => value.toFixed(1),
				numberFormat: (value: number) => {
					const date = new Date(value);
					const dateString = new Intl.DateTimeFormat('en-NZ', {
						dateStyle: 'short',
					}).format(date);
					const timeString = new Intl.DateTimeFormat('en-NZ', {
						timeStyle: 'short',
					}).format(date);

					const dateTimeString = `${dateString} ${timeString}`;

					return dateTimeString;
				},
				dateFormat: new Intl.DateTimeFormat('en-NZ'),
			},
		}
	);

	const $lineChart = document.getElementById('line-chart');
	if ($lineChart) {
		$lineChart.innerHTML = lineChartHtml;
	}
};

analyse();

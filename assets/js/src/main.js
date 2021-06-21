import * as analyser from '/analyser';

const analyse = async function () {
	const fileInfoA = {
		path: '/assets/data/Prison Population - raw.csv',
		headerRows: 1,
		cols: analyser.getColNumbers({
			DATE: 'A',
			REMAND_MALE: 'B',
			REMAND_FEMALE: 'C',
			REMAND_TOTAL: 'D',
			SENTENCED_MALE: 'E',
			SENTENCED_FEMALE: 'F',
			SENTENCED_TOTAL: 'G',
			TOTAL_MALE: 'H',
			TOTAL_MALE: 'I',
			TOTAL_TOTAL: 'J',
			ETHNICITY_MAORI: 'K',
			ETHNICITY_EUROPEAN: 'L',
			ETHNICITY_PACIFIC: 'M',
			ETHNICITY_ASIAN: 'N',
			ETHNICITY_OTHER: 'O',
			ETHNICITY_UNKNOWN: 'P',
			ETHNICITY_TOTAL: 'A',
			PER_100_000_POPULATION: 'R',
		}),
	};

	const fileInfoB = {
		path: '/assets/data/Tactical Options 2014 - raw.csv',
		headerRows: 1,
		cols: analyser.getColNumbers({
			TACTICAL_OPTION: 'A',
			EUROPEAN: 'B',
			MAORI: 'C',
			PACIFIC: 'D',
			OTHER: 'E',
		}),
	};

	let dataConfigArr = await analyser.loadFile(fileInfoA, fileInfoB);

	for (let dataConfig of dataConfigArr) {
		let { rows, cols } = dataConfig;

		console.log(rows);
		console.log(rows.getCol(0));
	}

	let { rows, cols } = dataConfigArr[0];

	let newCol = rows.getCol(cols.REMAND_MALE).map((num) => num/10);

	let newColIndex = rows.addCol(newCol);
	console.log(rows.getCol(newColIndex));

	let derivedColIndex = rows.addDerivedCol((row, extraVal1) => {
		return row[1] + row[2] - extraVal1;
	}, newCol);
	console.log(rows.getCol(derivedColIndex));

	console.table(rows.createSubTable(cols));
	console.log(rows.createSubTableString(cols));

	rows = dataConfigArr[1].rows;
	cols = dataConfigArr[1].cols;

	console.log(rows.getColSummary(cols.TACTICAL_OPTION));

	let dataSeries = rows.getColAsDataSeries(cols.TACTICAL_OPTION, Object.keys(rows.getColSummary(cols.TACTICAL_OPTION)));
	console.log(dataSeries);

	let comparisonSummary = rows.getComparisonSummary(cols.TACTICAL_OPTION, cols.MAORI);
	console.log(comparisonSummary);

	let comparisonSummaryString = rows.getComparisonSummaryString(cols.TACTICAL_OPTION, cols.MAORI);
	console.log(comparisonSummaryString);

	console.log(rows.getComparisonSummaryString(cols.TACTICAL_OPTION, cols.MAORI));
};

analyse();

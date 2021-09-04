const exampleAConfig = {
	path: 'city example.csv',
	cols: {
		NAME: 'A',
		COUNTRY: 'B',
		POPULATION: 'C',
		CAPITAL: 'D',
		PUBLIC_TRANSPORT: 'E',
		MAYOR_2012: 'F',
		MAYOR_2018: 'G',
	},
	headerRows: 1,
};

const exampleBConfig = {
	path: 'city example 2.csv',
	cols: {
		NAME: 'A',
		COUNTRY: 'B',
		POPULATION: 'C',
	},
	headerRows: 1,
};

const exampleCConfig = {
	path: 'city example 3.csv',
	cols: {
		YEAR: 'A',
		POPULATION: 'B',
	},
	headerRows: 1,
};

export {
	exampleAConfig,
	exampleBConfig,
	exampleCConfig,
};
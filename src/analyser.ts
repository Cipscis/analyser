import { parse } from 'csv';

class AnalyserRows extends Array {
	constructor(sourceArray) {
		// Don't use spread operator as it will cause a
		// stack overflow error with very large arrays
		// super(...sourceArray);
		super(sourceArray.length);
		for (let i = 0; i < sourceArray.length; i++) {
			this[i] = sourceArray[i];
		}
	}


	//////////////////////
	// HELPER FUNCTIONS //
	//////////////////////
	getCol(colNum) {
		const col = this.map((row) => row[colNum]);
		return col;
	}


	//////////////////////////////
	// TRANSFORMING INFORMATION //
	//////////////////////////////
	addCol(col) {
		// Edits the passed rows array to add an extra column
		// to it, then returns the index of that new column

		if (this.length !== col.length) {
			throw new Error(`Cannot add col of length ${col.length} to rows of length ${this.length}`);
		}

		const colIndex = this[0].length;

		for (let [i, row] of this.entries()) {
			row.push(col[i]);
		}

		return colIndex;
	}

	getDerivedCol(processFn, ...cols) {
		// Creates an array analogous to a column as returns
		// by the getCol function, where its output is the
		// result of applying the processFn function to the row
		// any number of values from optional column arguments

		const derivedCol = this.map((row, i) => {
			const derivedValues = [row];

			for (let col of cols) {
				derivedValues.push(col[i]);
			}

			return processFn.apply(this, derivedValues);
		});

		return derivedCol;
	}

	addDerivedCol(callback, ...cols) {
		// Works like getDerivedCol, but instead of returning
		// the derived column directly it uses addCol to add
		// it to rows and returns the new column index.

		const derivedCol = this.getDerivedCol.apply(this, arguments);

		return this.addCol(derivedCol);
	}


	///////////////////
	// SUMMARY TOOLS //
	///////////////////
	createSubTable(cols, arraySeparator) {
		// Takes in a set of rows and a cols object formatted like this:
		// {
		// 	ETHNICITY: 3,
		// 	AGE: 6
		// }

		// Outputs an array of objects,
		// each of which has the same indices as cols and represents a row
		// The output can be used with console.table

		arraySeparator = arraySeparator || ', ';

		const table = this.map((row) => {
			const newRow = {};

			for (let colName in cols) {
				const col = cols[colName];
				const cell = row[col]
				// Join arrays so they display in console.table
				if (cell instanceof Array) {
					newRow[colName] = cell.join(arraySeparator);
				} else {
					newRow[colName] = cell;
				}
			}

			return newRow;
		});

		return table;
	}

	createSubTableString(cols) {
		const table = this.createSubTable(cols, ',');
		const tableString = Analyser._convertTableToString(table);

		return tableString;
	}

	getColSummary(cols, aliasList) {
		// Takes in a set of rows and one or more column numbers, and optionally
		// a list of aliases - an array of arrays of strings to be grouped together

		// Outputs an object summarising the number of times each value
		// appeared in the given column of the given rows


		// Allow the passing of a single number or an array of column indices
		if (!(cols instanceof Array)) {
			cols = [cols];
		}

		const summary = {};
		for (let row of this) {
			for (let col of cols) {
				const cellValue = row[col];

				if (typeof cellValue !== 'undefined' && cellValue !== '') {
					let values;

					if (cellValue instanceof Array) {
						values = cellValue;
					} else {
						values = [cellValue];
					}

					for (let value of values) {
						if (value in summary) {
							summary[value]++;
						} else {
							summary[value] = 1;
						}
					}

				}

			}
		}

		if (typeof aliasList !== 'undefined') {
			summary = Analyser._groupColSummaryByAliases(summary, aliasList);
		}

		return summary;
	}

	getColAsDataSeries(col, labels) {
		// Takes in a set of rows and a column number,
		// and an array of labels. Outputs an array where
		// each element is the count of the values matching
		// the element of labels at the same index

		const colSummary = this.getColSummary(col);

		const dataSeries = [];

		for (let i = 0; i < labels.length; i++) {
			dataSeries[i] = 0;
		}

		for (let i in colSummary) {
			const value = colSummary[i];
			let index = labels.indexOf(i);
			if (index === -1) {
				// Couldn't find index, try forcing it to be a number
				index = labels.indexOf(parseInt(i, 10));
			}

			if (index !== -1) {
				dataSeries[index] = value;
			}
		}

		return dataSeries;
	}

	getComparisonSummary(headerCol, headerAliases, varCol, varAliases) {
		// Takes in a set of rows and two column numbers
		// Creates an object that can be used with console.table
		// with the values of headerCol used in the header, and
		// the values of varCol used for each row, with the cells
		// denoting the number of times these values coincided
		// using filterRows with the passed sets of aliases

		// Also optionally takes a set of aliases for one or both columns

		if (arguments.length === 2) {
			// No aliases specified
			varCol = headerAliases;
			headerAliases = undefined;
		} else if (arguments.length === 3) {
			// One alias specified
			if (!(headerAliases instanceof Array)) {
				// headerAliases was not passed
				varAliases = varCol;
				varCol = headerAliases;
				headerAliases = undefined;
			}
		}

		const headerSummary = this.getColSummary(headerCol, headerAliases);
		const varSummary = this.getColSummary(varCol, varAliases);

		const aliases = {};
		if (headerAliases) {
			aliases.HEADERS = headerAliases;
		}
		if (varAliases) {
			aliases.VARS = varAliases;
		}
		const by = Analyser._getAliasFilters(aliases);

		const comparisonSummary = {};
		for (let i in varSummary) {
			comparisonSummary[i] = {};
			for (let j in headerSummary) {
				comparisonSummary[i][j] = this.filter(
					by(varCol, Analyser._extractValue(i))
					.andBy(headerCol, Analyser._extractValue(j))
				).length;
			}
		}

		return comparisonSummary;
	}

	getComparisonSummaryString(headerCol, headerAliases, varCol, varAliases) {
		// Calls getComparisonSummary with all arguments passed,
		// then returns a string of the data that can be copy/pasted
		// into a spreadsheet

		const comparisonSummary = this.getComparisonSummary.apply(this, arguments);
		const comparisonSummaryString = Analyser._convertTableToString(comparisonSummary, true);

		return comparisonSummaryString;
	}
}

const Analyser = {
	/////////////////////
	// FILE PROCESSING //
	/////////////////////
	loadFile: async function (...fileConfigArr) {
		// Load each file, then resolve the wrapping promise once all are loaded
		const promises = fileConfigArr.map((fileConfig) => Analyser._loadFile(fileConfig))

		if (fileConfigArr.length > 1) {
			// This returns an array matching fileConfigArr
			return await Promise.all(promises);
		} else {
			return await promises[0];
		}
	},

	_loadFile: async function (fileConfig) {
		const response = await fetch(fileConfig.path);

		if (response.ok) {
			const data = await response.text();

			const rows = parse(data, { mapper: Analyser._extractValue });
			const dataConfig = Analyser._processData(rows, fileConfig);
			return dataConfig;
		} else {
			throw new Error(`Failed to fetch file at ${fileConfig.path}: ${response.status}`);
		}
	},

	_processData: function (rows, fileConfig) {
		// TODO: Either rewrite comment or move it entirely into documentation
		// TODO: Rewrite defaultCols and defaultColValues behaviour
		// TODO: Make building nums have to be explicit, instead of default

		// Takes in fileConfig with the following properties:
		// The number of header rows to remove from rows
		// A fileConfig object for column names
		// An optional set of aliases
		// An optional set of columns whose values should be treated as arrays
		// An optional set of columns with default values
		// An optional map of columns that should be combined when collecting enums

		// The output contains the following properties:
		// The header rows that were removed
		// The fileConfig object for column names
		// A set of filters respecting the given aliases
		// Enums collected according to the specified column names and optional enumsMap

		// Example data:
		// headerRows = 2;
		// footerRows = 1;

		// cols = Analyser.getColNumbers({
		// 	ETHNICITY: 'K',
		// 	TACTICS: 'M'
		// });

		// arrayCols = {};
		// arrayCols[cols.TACTICS] = ' ';

		// defaultCols = {};
		// defaultCols[cols.VALUE] = 0;

		// defaultColValues = {};
		// defaultColValues[cols.VALUE] = '-';

		// aliases = {
		// 	ETHNICITY: [
		// 		[
		// 			'Pacific', //Not represented in data, but used as a label
		// 			'Pacific Island',
		// 			'Pacific Islander'
		// 		]
		// 	]
		// };

		// enumsMap = {
		// 	TASER_METHOD: [cols.TASER_METHOD_1, cols.TASER_METHOD_2, cols.TASER_METHOD_3]
		// };

		fileConfig.headerRows = fileConfig.headerRows || 0;
		fileConfig.footerRows = fileConfig.footerRows || 0;
		fileConfig.cols = fileConfig.cols || {};
		fileConfig.aliases = fileConfig.aliases || {};
		fileConfig.arrayCols = fileConfig.arrayCols || {};
		fileConfig.enumsMap = fileConfig.enumsMap || {};
		fileConfig.uniqueCols = fileConfig.uniqueCols || [];

		const dataConfig = {};
		dataConfig.cols = fileConfig.cols;
		dataConfig.aliases = fileConfig.aliases;
		dataConfig.by = Analyser._getAliasFilters(fileConfig.aliases);
		dataConfig.enumsMap = fileConfig.enumsMap; // Keep this for combining data

		if (fileConfig.headerRows !== 0) {
			// Remove header rows
			rows.splice(0, fileConfig.headerRows);
		}

		if (fileConfig.footerRows !== 0) {
			// Remove footer rows
			rows.splice(-fileConfig.footerRows);
		}

		// Convert cells that are lists into arrays
		dataConfig.rows = new AnalyserRows(rows);
		for (let i = 0; i < dataConfig.rows.length; i++) {
			const row = dataConfig.rows[i];

			for (let j in fileConfig.arrayCols) {
				row[j] = (row[j] + '').trim().split(fileConfig.arrayCols[j] || ' ');
			}

			// Remove default values from specified columns
			for (let j in fileConfig.defaultColValues) {
				if (j in fileConfig.arrayCols) {
					continue;
				}
				if ((row[j] + '') === (fileConfig.defaultColValues[j] + '')) {
					row[j] = '';
				}
			}

			// Add default values to empty cells in default cols
			for (let j in fileConfig.defaultCols) {
				if (j in fileConfig.arrayCols) {
					continue;
				}
				if ((row[j] + '').trim() === '') {
					row[j] = fileConfig.defaultCols[j];
				}
			}
		}

		// Build enums
		dataConfig.enums = Analyser._buildEnums(rows, fileConfig);

		return dataConfig;
	},

	_buildEnums: function (rows, config) {
		const enums = {};

		for (let col in config.cols) {

			// Don't collect enums for columns specified in uniqueCols or enumsMap
			let collect = true;
			if (config.uniqueCols.includes(config.cols[col])) {
				collect = false;
			}
			for (let enumCol in config.enumsMap) {
				if (config.enumsMap[enumCol].includes(config.cols[col])) {
					collect = false;
					break;
				}
			}

			if (collect) {
				enums[col] = [];
				Analyser._collectEnums(rows, enums[col], config.cols[col]);
			}
		}
		for (let enumCol in config.enumsMap) {
			enums[enumCol] = [];
			Analyser._collectEnums.apply(this, [rows, enums[enumCol]].concat(config.enumsMap[enumCol]));
		}

		return enums;
	},

	_collectEnums: function (rows, enumsArr, ...cols) {
		// Go through all cells in a given set of columns
		// and add all unique entries found to enumsArr

		enumsArr = enumsArr || [];

		for (let row of rows) {
			for (let col of cols) {
				const cell = row[col];

				if (cell instanceof Array) {
					for (let value of cell) {
						if ((value !== '') && (enumsArr.indexOf(value) === -1)) {
							enumsArr.push(value);
						}
					}
				} else {
					if ((cell !== '') && (enumsArr.indexOf(cell) === -1)) {
						enumsArr.push(cell);
					}
				}
			}
		}

		return enumsArr;
	},

	combineData: function (...dataConfigs) {
		// TODO: Rewrite

		// // Takes in any number of dataConfig objects from _processData
		// // Combines the rows and relevant dataConfig objects (e.g. aliases, enums)
		// // Keeps only columns shared by all dataConfig objects

		// // Assumes there is no data shared between different sets,
		// // so duplicates will *not* be detected or removed

		// // The output is in the same format as for _processData

		// let combinedDataConfig = {
		// 	cols: {},
		// 	rows: new AnalyserRows([]),
		// 	aliases: {}
		// };

		// if (!dataConfigs || dataConfigs.length < 2) {
		// 	console.error('Invalid inputs passed to combineData', arguments);
		// }

		// // Combine cols first //

		// // Build base set from first cols object
		// for (let j in dataConfigs[0].cols) {
		// 	combinedDataConfig.cols[j] = true;
		// }

		// // Remove any cols not shared by every other cols object
		// for (let i = 1; i < dataConfigs.length; i++) {
		// 	let dataConfig = dataConfigs[i];

		// 	for (let j in combinedDataConfig.cols) {
		// 		if (!(j in dataConfig.cols)) {
		// 			delete combinedDataConfig.cols[j];
		// 		}
		// 	}
		// }

		// let colIndex = 0;
		// for (let j in combinedDataConfig.cols) {
		// 	combinedDataConfig.cols[j] = colIndex;
		// 	colIndex++;
		// }

		// // Now that we have the combined cols object, combine rows and aliases
		// for (let i = 0; i < dataConfigs.length; i++) {
		// 	let dataConfig = dataConfigs[i];
		// 	// Combine rows //

		// 	for (let j = 0; j < dataConfig.rows.length; j++) {
		// 		let row = [];
		// 		for (let k in combinedDataConfig.cols) {
		// 			row[combinedDataConfig.cols[k]] = dataConfig.rows[j][dataConfig.cols[k]];
		// 		}

		// 		combinedDataConfig.rows.push(row);
		// 	}


		// 	// Combine aliases //

		// 	// Loop through each row's aliases to combine
		// 	for (let j in dataConfig.aliases) {

		// 		// If we don't have an alias for this column, make an empty placeholder
		// 		if (!(j in combinedDataConfig.aliases)) {
		// 			combinedDataConfig.aliases[j] = [];
		// 		}

		// 		// Loop through each aliasSet for this column
		// 		for (let k = 0; k < dataConfig.aliases[j].length; k++) {
		// 			let aliasSet = dataConfig.aliases[j][k];

		// 			// Combine aliasSets based off their first element, which is used as a label
		// 			let combinedAliasSet = [];
		// 			let l;
		// 			for (l = 0; l < combinedDataConfig.aliases[j].length; l++) {
		// 				if (combinedDataConfig.aliases[j][l][0] === aliasSet[0]) {
		// 					combinedAliasSet = combinedDataConfig.aliases[j][l];
		// 					break;
		// 				}
		// 			}

		// 			combinedAliasSet = combinedAliasSet.concat(aliasSet);

		// 			// Remove duplicates
		// 			combinedAliasSet = combinedAliasSet.filter(function (alias, index, array) {
		// 				return array.indexOf(alias) === index;
		// 			});

		// 			// Append or replace aliasSet in combinedDataConfig
		// 			if (l < combinedDataConfig.aliases[j].length) {
		// 				combinedDataConfig.aliases[j][l] = combinedAliasSet;
		// 			} else {
		// 				combinedDataConfig.aliases[j].push(combinedAliasSet);
		// 			}
		// 		}
		// 	}
		// }

		// // Create new filters using combined aliases
		// combinedDataConfig.by = Analyser._getAliasFilters(combinedDataConfig.aliases);

		// // Combine uniqueCols
		// combinedDataConfig.uniqueCols = [];
		// for (let i = 0; i < dataConfigs.length; i++) {
		// 	let dataConfig = dataConfigs[i];

		// 	for (let j in dataConfig.uniqueCols) {
		// 		let originalCol = dataConfig.uniqueCols[j];
		// 		let originalColName = undefined;
		// 		for (let k in dataConfig.cols) {
		// 			if (dataConfig.cols[l] === originalCol) {
		// 				originalColName = l;
		// 				break;
		// 			}
		// 		}

		// 		if (originalColName) {
		// 			let originalColIndex = combinedDataConfig.cols[originalColName];

		// 			if (combinedDataConfig.uniqueCols.indexOf(originalColIndex) === -1) {
		// 				combinedDataConfig.uniqueCols.push(combinedDataConfig.cols[originalColName]);
		// 			}
		// 		}
		// 	}
		// }

		// // Combine the enumsMaps, then build combined enums
		// combinedDataConfig.enumsMap = {};
		// for (let i = 0; i < dataConfigs.length; i++) {
		// 	let dataConfig = dataConfigs[i];

		// 	for (let j in dataConfig.enumsMap) {
		// 		let originalEnumsMap = dataConfig.enumsMap[j];

		// 		if (!originalEnumsMap) {
		// 			// Mark this enumsMap as null to denote that it doesn't
		// 			// exist across all dataConfigs we are combining
		// 			combinedDataConfig.enumsMap[j] = null;
		// 		} else {
		// 			if (combinedDataConfig.enumsMap[j] !== null) {
		// 				combinedDataConfig.enumsMap[j] = combinedDataConfig.enumsMap[j] || [];

		// 				for (let k = 0; k < originalEnumsMap.length; k++) {
		// 					let originalCol = originalEnumsMap[k];
		// 					let originalColName = undefined;
		// 					for (let l in dataConfig.cols) {
		// 						if (dataConfig.cols[l] === originalCol) {
		// 							originalColName = l;
		// 							break;
		// 						}
		// 					}

		// 					if (originalColName) {
		// 						let originalColIndex = combinedDataConfig.cols[originalColName];

		// 						if (combinedDataConfig.enumsMap[j].indexOf(originalColIndex) === -1) {
		// 							combinedDataConfig.enumsMap[j].push(combinedDataConfig.cols[originalColName]);
		// 						}
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}

		// 	for (let j in combinedDataConfig.enumsMap) {
		// 		if (combinedDataConfig.enumsMap[j] === null) {
		// 			delete combinedDataConfig[enumsMap[j]];
		// 		}
		// 	}
		// }
		// combinedDataConfig.enums = Analyser._buildEnums(combinedDataConfig.rows, combinedDataConfig);

		// return combinedDataConfig;
	},

	/////////////////
	// CSV PARSING //
	/////////////////
	_extractValue: function (string) {
		// Convert strings to booleans or numbers where possible

		if (string === 'true') {
			return true;
		} else if (string === 'false') {
			return false;
		} else {
			return Analyser._extractNumber(string);
		}
	},

	_extractNumber: function (string) {
		// Convert strings to numbers where possible

		let val = string.replace(/,|%$/g, '');

		if (parseFloat(val) === +val) {
			const isPercentage = string.match(/%$/);

			if (isPercentage) {
				// If the value is a percentage, divide by 100

				// Convert to string to see how many places after the point, to round after dividing
				// Otherwise you'll get numbers like 0.10800000000000001
				let stringVal = val + '';
				let truncatedStringVal = stringVal.replace(/^[^.]+/, '');
				let length = truncatedStringVal.length;

				val = val / 100;
				val = val.toFixed(length+2);
			}
			return +val;
		} else {
			return string;
		}
	},

	///////////////
	// FILTERING //
	///////////////
	_getAliasFilters: function (aliases) {
		const by = function (colIndex, values) {
			const filterFn = (row) => Analyser._applyFilter(row, colIndex, values, aliases);

			filterFn.andBy = (colIndex, values) => {
				return (row) => filterFn(row) && Analyser._applyFilter(row, colIndex, values, aliases);
			};
			filterFn.orBy = (colIndex, values) => {
				return (row) => filterFn(row) && Analyser._applyFilter(row, colIndex, values, aliases);
			};

			Analyser._extendFilter(filterFn, aliases);

			return filterFn;
		};

		return by;
	},

	_extendFilter: function (filterFn, aliases) {
		filterFn.andBy = (colIndex, values) => {
			const newFilterFn = (row) => filterFn(row) && Analyser._applyFilter(row, colIndex, values, aliases);

			Analyser._extendFilter(newFilterFn, aliases);
			return newFilterFn;
		};
		filterFn.orBy = (colIndex, values) => {
			const newFilterFn = (row) => filterFn(row) || Analyser._applyFilter(row, colIndex, values, aliases);

			Analyser._extendFilter(newFilterFn, aliases);
			return newFilterFn;
		};

		return filterFn;
	},

	_applyFilter: function (row, colIndex, values, aliases) {
		// Allow functions to be passed as filter tests
		if (values instanceof Function) {
			return values(row[colIndex]);
		}

		// If one or more values is passed, test it against aliases
		if (!(values instanceof Array)) {
			values = [values];
		}

		const cell = row[colIndex];
		let cellValues;

		if (cell instanceof Array) {
			cellValues = cell;
		} else {
			cellValues = [cell];
		}

		for (let cellValue of cellValues) {
			for (let value of values) {
				if (Analyser._matchAlias(value, cellValue, aliases)) {
					return true;
				}
			}
		}

		return false;
	},

	_matchAlias: function (cell, value, aliasSuperset) {
		// Checks if the value of a cell matches the value passed,
		// optionally taking one or more sets of aliases to match

		// The aliasSuperset is used because the default set of all
		// aliases will be used if no aliasSet is specified

		if (cell === value) {
			return true;
		}

		// Could be array or object
		for (let i in aliasSuperset) {
			const aliasSet = aliasSuperset[i];
			for (let aliasList of aliasSet) {

				if (
					(aliasList.indexOf(cell) !== -1) &&
					(aliasList.indexOf(value) !== -1)
				) {
					return true;
				}
			}
		}

		return false;
	},

	//////////////////////
	// HELPER FUNCTIONS //
	//////////////////////
	getColNumber: function (colName) {
		// Takes in a string like "CE" and converts it to a row number like 82

		if (Number.isInteger(colName) && colName >= 0) {
			// A positive integer
			return colName;
		} else if (!(typeof colName === 'string' || colName instanceof String)) {
			// Not a string
			return null;
		} else if (colName.length === 0) {
			// Empty string
			return null;
		}

		const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		let rowNumber = -1; // Adjust for 0-based counting

		const upperColName = colName.toUpperCase();
		for (let i = 0; i < upperColName.length; i++) {
			const char = upperColName[i];
			const charIndex = alphabet.indexOf(char);

			if (charIndex === -1) {
				// String contains invalid character
				return null;
			}

			rowNumber += (charIndex + 1) * Math.pow(alphabet.length, colName.length - (i+1));
		}

		return rowNumber;
	},

	getColNumbers: function (cols) {
		// Takes in a flat object and runs each property through getColNumber
		const newCols = {};

		for (let key in cols) {
			newCols[key] = Analyser.getColNumber(cols[key]);
		}

		return newCols;
	},

	///////////////////
	// SUMMARY TOOLS //
	///////////////////
	_convertTableToString: function (table, useKeys, cellSeparatorOption, rowSeparatorOption) {
		const cellSeparator = cellSeparatorOption || '\t';
		const rowSeparator = rowSeparatorOption || '\n';

		let tableString = '';

		const addCell = (cellString) => {
			if (typeof cellString !== 'string') {
				cellString = '' + cellString;
			}

			if (cellString.indexOf(cellSeparator) !== -1) {
				// If the cell string contains the separator sequence,
				// wrap it in " and escape any existing " as ""
				cellString = '"' + cellString.replace(/"/g, '""') + '"';
			}

			tableString += cellString + cellSeparator;
		};
		const endLine = () => {
			// Trim off last cell separator, replace with newline
			tableString = tableString.substr(0, tableString.length - cellSeparator.length) + rowSeparator;
		};

		// Render headers and create array of labels
		if (useKeys) {
			tableString += cellSeparator;
		}

		let firstRowComplete = false;
		for (let rowName in table) {
			if (firstRowComplete === true) {
				break;
			}
			firstRowComplete = true;

			let row = table[rowName];
			for (let colName in row) {
				addCell(colName);
			}
		}
		endLine();

		for (let rowName in table) {
			let isFirstRow = false;
			const row = table[rowName];
			for (let colName in row) {
				const cell = row[colName];
				if (useKeys) {
					if (isFirstRow === false) {
						addCell(rowName);
					}
					isFirstRow = true;
				}

				addCell(cell);
			}
			endLine();
		}

		return tableString;
	},

	_groupColSummaryByAliases: function (summary, aliasList) {
		// Takes a summary object like the output from getColSummary, and
		// a list of aliases - an array of arrays of strings to be grouped together

		// Outputs a summary object where values within the same set of aliases are grouped

		const newSummary = {};
		for (let i in summary) {
			let inAlias = false;
			for (let aliases of aliasList) {
				if (aliases.indexOf(i) !== -1) {
					inAlias = true;
					if (aliases[0] in newSummary) {
						newSummary[aliases[0]] += summary[i];
					} else {
						newSummary[aliases[0]] = summary[i];
					}
				}
			}

			if (inAlias === false) {
				newSummary[i] = summary[i];
			}
		}

		return newSummary;
	}
};

export const {
	loadFile,
	// combineData, // TODO: Rewrite

	getColNumber,
	getColNumbers,
} = Analyser;

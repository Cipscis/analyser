import { parse as parseCSV } from '@cipscis/csv';

import { AnalyserRows } from './AnalyserRows.js';
import { FileConfig } from './FileConfig.js';
import { DataConfig } from './DataConfig.js';

import { getColNumbers } from './helpers.js';

import { createGroupFn } from './grouping.js';
import { createFilterFn } from './filtering.js';

import * as transformers from './transformers.js';

/**
 * Load a single CSV file and process its contents, then return them.
 */
async function loadFile<T extends string>(fileConfig: FileConfig<T>): Promise<DataConfig<T>> {
	const response = await fetch(fileConfig.path);

	if (response.ok) {
		const data = await response.text();

		const rows = parseCSV(data);
		const dataConfig = _processData(rows, fileConfig);
		return dataConfig;
	} else {
		throw new Error(`Failed to fetch file at ${fileConfig.path}: ${response.status}`);
	}
}

/**
 * Processes CSV data into a DataConfig object ready for analysis via code.
 */
function _processData<T extends string>(rows: string[][], fileConfig: FileConfig<T>): DataConfig<T> {
	// Remove header rows
	if (fileConfig.headerRows) {
		rows.splice(0, fileConfig.headerRows);
	}

	// Remove footer rows
	if (fileConfig.footerRows) {
		rows.splice(-fileConfig.footerRows);
	}

	const cols = getColNumbers(fileConfig.cols);

	// Remove any specified rows to ignore
	const { ignoreRows } = fileConfig;
	if (ignoreRows) {
		// Find all rows that match the `ignoreRows` function
		const rowsToIgnore = rows.filter((row) => ignoreRows(row, cols));

		// If we found any rows to ignore, remove them
		if (rowsToIgnore.length > 0) {
			for (let i = rows.length-1; i >= 0; i--) {
				const row = rows[i];
				if (rowsToIgnore.includes(row)) {
					rows.splice(i, 1);
				}
			}
		}
	}

	const by = createFilterFn(fileConfig.aliases);
	const group = createGroupFn(by, fileConfig.aliases);

	const dataConfig: DataConfig<T> = {
		rows: new AnalyserRows(rows),
		cols,
		addedCols: {},
		by,
		group,
	};

	if (fileConfig.aliases) {
		dataConfig.aliases = fileConfig.aliases;
	}

	if (fileConfig.transform) {
		for (const colName in fileConfig.transform) {
			if (!(colName in dataConfig.cols)) {
				console.warn(`Column '${colName}' specified in transform not found in cols.`);
			} else {
				const colNum = dataConfig.cols[colName];
				const transformFn = fileConfig.transform[colName];

				// These conditions are intended to help when TypeScript isn't being used
				if (transformFn === transformers.array) {
					throw new Error(`The 'array' transformer cannot be used directly. Please pass a 'separator' argument.`);
				} else if (transformFn === transformers.booleanCustom) {
					throw new Error(`The 'booleanCustom' transformer cannot be used directly. Please invoke it to create a transformer function.`);
				// @ts-expect-error This check is only intended to catch errors if an incorrectly typed value is passed
				} else if (transformFn === transformers.enumValue) {
					throw new Error(`The 'enumValue' transformer cannot be used directly. Please pass an 'enums' argument.`);
				}

				for (const [index, row] of rows.entries()) {
					if (transformFn) {
						const locationIdentifier = `column ${colName}, row ${index}`;
						dataConfig.rows[index][colNum] = transformFn(row[colNum], locationIdentifier);
					}
				}
			}
		}
	}

	return dataConfig;
}

export { loadFile };

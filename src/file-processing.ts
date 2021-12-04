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
 *
 * @param  {FileConfig} fileConfig - Details of how to load and process the file
 *
 * @return {Promise<DataConfig>} - The processed data from the file.
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
 *
 * @param  {(string | boolean | number)[][]} rows - CSV data.
 * @param  {FileConfig} fileConfig - Instructions on how to process the CSV data.
 *
 * @return {DataConfig} - Processed CSV data and helpers for analysing it.
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

	const by = createFilterFn(fileConfig.aliases);
	const group = createGroupFn(by, fileConfig.aliases);

	const dataConfig: DataConfig<T> = {
		rows: new AnalyserRows(rows),
		cols: getColNumbers(fileConfig.cols),
		addedCols: {},
		by,
		group,
	};

	if (fileConfig.aliases) {
		dataConfig.aliases = fileConfig.aliases;
	}

	if (fileConfig.transform) {
		for (let colName in fileConfig.transform) {
			if (!(colName in dataConfig.cols)) {
				console.warn(`Column '${colName}' specified in transform not found in cols.`);
			} else {
				const colNum = dataConfig.cols[colName];
				const transformFn = fileConfig.transform[colName];

				if (transformFn === transformers.array) {
					throw new Error(`The 'array' transformer cannot be used directly. Please pass a 'separator' argument.`);
				}

				for (let row of rows) {
					if (transformFn) {
						row[colNum] = transformFn(row[colNum]);
					}
				}
			}
		}
	}

	return dataConfig;
}

export { loadFile };

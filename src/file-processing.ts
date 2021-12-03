import { parse as parseCSV } from '@cipscis/csv';

import { AnalyserRows } from './AnalyserRows.js';
import { FileConfig } from './FileConfig.js';
import { DataConfig } from './DataConfig.js';

import { getColNumbers } from './helpers.js';

import { createGroupFn } from './grouping.js';
import { createFilterFn } from './filtering.js';

import * as transformers from './transformers.js';

/**
 * Load one of more files, process the data they contain, and return it.
 *
 * @param  {...FileConfig} fileConfigs - One or more FileConfigs detailing how to load and process files.
 *
 * @return {Promise<DataConfig | DataConfig[]>} - The processed data contained in all the loaded files.
 */
async function loadFile(fileConfig: FileConfig): Promise<DataConfig>
async function loadFile(...fileConfigs: FileConfig[]): Promise<DataConfig[]>
async function loadFile(...fileConfigs: FileConfig[]): Promise<DataConfig | DataConfig[]> {
	const promises = fileConfigs.map((fileConfig) => _loadSingleFile(fileConfig));

	if (promises.length > 1) {
		return await Promise.all(promises);
	} else {
		return await promises[0];
	}
}

/**
 * Load a single CSV file and process its contents, then return them.
 *
 * @param  {FileConfig} fileConfig - Details of how to load and process the file
 *
 * @return {Promise<DataConfig>} - The processed data from the file.
 */
async function _loadSingleFile(fileConfig: FileConfig): Promise<DataConfig> {
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
function _processData(rows: string[][], fileConfig: FileConfig): DataConfig {
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

	const dataConfig: DataConfig = {
		rows: new AnalyserRows(rows),
		cols: getColNumbers(fileConfig.cols),
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

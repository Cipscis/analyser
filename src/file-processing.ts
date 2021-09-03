import { parse as parseCSV } from '@cipscis/csv';

import { AnalyserRows } from './AnalyserRows.js';
import { FileConfig } from './FileConfig.js';
import { DataConfig } from './DataConfig.js';

import { createFilterFn } from './filtering.js';

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
 * @return {DataConfig} - The processed data from the file.
 */
async function _loadSingleFile(fileConfig: FileConfig): Promise<DataConfig> {
	const response = await fetch(fileConfig.path);

	if (response.ok) {
		const data = await response.text();

		const rows = parseCSV(data, _extractValue);
		const dataConfig = _processData(rows, fileConfig);
		return dataConfig;
	} else {
		throw new Error(`Failed to fetch file at ${fileConfig.path}: ${response.status}`);
	}
}

function _processData(rows: (string | boolean | number)[][], fileConfig: FileConfig): DataConfig {
	// Remove header rows
	if (fileConfig.headerRows) {
		rows.splice(0, fileConfig.headerRows);
	}

	// Remove footer rows
	if (fileConfig.footerRows) {
		rows.splice(0, fileConfig.footerRows);
	}

	const dataConfig: DataConfig = {
		rows: new AnalyserRows(rows),
		cols: fileConfig.cols,
		by: createFilterFn(fileConfig.aliases),
	};

	if (fileConfig.aliases) {
		dataConfig.aliases = fileConfig.aliases;
	}
	return dataConfig;
}

/**
 * Extracts boolean or number values from string representations if appropriate.
 *
 * @param  {string} value - A string that may represent a boolean or a number.
 *
 * @return {string} - The value represented by the input string.
 */
function _extractValue(value: string): string | boolean | number {
	if (value === 'true') {
		return true;
	} else if (value === 'false') {
		return false;
	} else {
		return _extractNumber(value);
	}
}

/**
 * Extracts a number from a string representation, if it contains one. Strings ending with '%' are treated as percentages and divided by 100.
 *
 * @param  {string} value - A string that may represent a number.
 *
 * @return {string} - The value represented by the input string.
 */
function _extractNumber(value: string): string | number {
	let cleanValue = value.replace(/,|%$/g, '');

	if (parseFloat(cleanValue) === +cleanValue) {
		// Condition matches if the entire string represents a number

		const isPercentage = value.match(/%$/);
		if (isPercentage) {
			// If value is a percentage string, divide by 100

			// To prevent division causing rounding errors, like
			// 0.10800000000000001, use string representation to
			// determine how to round the number.

			// e.g. convert '82.643' to '643'
			const truncatedValue = cleanValue.replace(/^[^.]+\.?/, '');
			const precision = truncatedValue.length;

			const numValue = +cleanValue / 100;
			// Add 2 to precision to compensate for dividing by 100
			cleanValue = numValue.toFixed(precision + 2);
		}

		return +cleanValue;
	} else {
		return value;
	}
}

export { loadFile };

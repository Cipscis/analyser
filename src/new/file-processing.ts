import { parse as parseCSV } from '@cipscis/csv';

import { FileConfig } from './FileConfig.js';
import { ProcessedData } from './ProcessedData.js';
import { Data } from './Data.js';
import { createFilterFn } from './filtering.js';

/**
 * Load a single CSV file and process its contents.
 */
export async function loadFile<
	ColName extends string,
	RowShape extends Record<ColName, unknown>,
>(fileConfig: FileConfig<ColName, RowShape>): Promise<ProcessedData<ColName, RowShape>> {
	const response = await fetch(fileConfig.path);

	if (response.ok) {
		const data = await response.text();

		const rows = parseCSV(data);
		const processedData = processData(rows, fileConfig);
		return processedData;
	}  else {
		throw new Error(`Failed to fetch file at ${fileConfig.path}: ${response.status} ${response.statusText}`);
	}
}

/**
 * Processes CSV data into usable, typed data.
 */
function processData<
	ColName extends string,
	RowShape extends Record<ColName, unknown>,
>(rows: readonly string[][], fileConfig: FileConfig<ColName, RowShape>): ProcessedData<ColName, RowShape> {
	const dataRows = rows.map((row) => row.concat());

	// Remove header rows
	if (fileConfig.headerRows) {
		dataRows.splice(0, fileConfig.headerRows);
	}

	// Remove footer rows
	if (fileConfig.footerRows) {
		dataRows.splice(-fileConfig.footerRows);
	}

	// Convert rows from index-based to name-based
	const cols = getColNumbers<ColName>(fileConfig.cols);
	const namedRows: Record<ColName, string>[] = dataRows.map((row) => {
		const namedRow: Partial<Record<ColName, string>> = {};

		for (const colName in cols) {
			namedRow[colName] = row[cols[colName]];
		}

		return namedRow as Record<ColName, string>;
	});

	// Transform each column into its configured type
	const typedRows: RowShape[] = namedRows.map((row) => {
		const typedRow: Partial<RowShape> = {};

		for (const colName in row) {
			const transformFn = fileConfig.cols[colName][1];

			typedRow[colName as ColName] = transformFn(row[colName]);
		}

		return typedRow as RowShape;
	});

	// Remove any specified rows to ignore
	const { ignoreRows } = fileConfig;
	if (ignoreRows) {
		// Find all rows that match the `ignoreRows` function
		const rowsToIgnore = typedRows.filter((row) => ignoreRows(row));

		// If we found any rows to ignore, remove them
		if (rowsToIgnore.length > 0) {
			// Count backwards so we don't need to update our cursor after splicing
			for (let i = typedRows.length - 1; i >= 0; i--) {
				const row = typedRows[i];
				if (rowsToIgnore.includes(row)) {
					typedRows.splice(i, 1);
				}
			}
		}
	}

	// TODO: `group`

	const processedData: ProcessedData<ColName, RowShape> = {
		rows: new Data(typedRows),

		by: createFilterFn(fileConfig.aliases),
	};

	// Persist any aliases from the `fileConfig`
	if (fileConfig.aliases) {
		processedData.aliases = fileConfig.aliases;
	}

	return processedData;
}

/**
 * Converts a map of column names to column identifiers using `getColNumber` so all column identifiers are integers.
 *
 * Any columns with invalid identifiers will be removed from the result.
 *
 * @param colsConfig - A map of column names to their indices
 */
function getColNumbers<ColName extends string>(colsConfig: Record<ColName, readonly [string | number, ...unknown[]]>): Record<ColName, number> {
	const entries = Object.entries<typeof colsConfig[keyof typeof colsConfig]>(colsConfig);

	const mappedEntries = entries.map(([name, [index]]) => {
		if (typeof index === 'number') {
			return [name, index] as const;
		} else {
			const colNumber = getColNumber(index);

			if (colNumber !== null) {
				return [name, colNumber] as const;
			} else {
				return null;
			}
		}
	}).filter((el): el is NonNullable<typeof el> => Boolean(el));

	const cols = Object.fromEntries(mappedEntries) as Record<ColName, number>;
	return cols;
}

/**
 * Convert a column heading from spreadsheet software to its integer representation. For example, converts 'A' to 0, or 'ZE' to 680.
 *
 * If a non-negative integer is passed, it will be returned untransformed. Any other value, including an invalid string, will return null.
 */
function getColNumber(index: number | string): number | null {
	if (typeof index === 'number') {
		if (Number.isInteger(index) && index >= 0) {
			return index;
		} else {
			return null;
		}
	} else if (index === '') {
		return null;
	} else if (typeof index !== 'string') {
		return null;
	}

	const alphabet: readonly string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	let colNumber = -1; // Adjust for 0-based counting

	const upperIndex = index.toUpperCase();
	for (let i = 0; i < upperIndex.length; i++) {
		const char = upperIndex[i];
		const charIndex = alphabet.indexOf(char);

		if (charIndex === -1) {
			// `index` contains an invalid character
			return null;
		}

		colNumber += (charIndex + 1) * Math.pow(alphabet.length, index.length - (i+1));
	}

	return colNumber;
}

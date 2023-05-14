import { parse as parseCSV } from '@cipscis/csv';

import { FileConfig } from './FileConfig.js';
import { Data } from './Data.js';
import * as types from './types/index.js';

// Type-only import to make symbol available to JSDoc.
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { TypeFn } from './types/TypeFn.js';

/**
 * Used to configure the behaviour of {@linkcode loadFile}
 */
interface LoadFileOptions {
	/**
	 * This property controls how {@linkcode loadFile} deals with errors
	 * being thrown by {@linkcode TypeFn type functions}.
	 *
	 * By default, these errors will not be caught, so they will output an
	 * error to the console detailing where the value that caused the error
	 * exists in your ddata.
	 *
	 * However, if {@linkcode LoadFileOptions.strict} is set to `false`, then
	 * instead these errors will result in a warning being output to the console,
	 * and the value that caused the error will be converted to `null`.
	 *
	 * This non-strict mode should only be used when initially determining how
	 * a data set should be processed, as the conversion of data to `null` is not
	 * type-safe.
	 */
	strict?: boolean;
}

const defaultOptions: LoadFileOptions = {
	strict: true,
};

/**
 * Loads a single CSV file configured with a {@linkcode FileConfig} object.
 *
 * If the file is loaded and processed successfully, the `Promise` returned
 * will resolve to a {@linkcode Data} object.
 *
 * @see {@linkcode LoadFileOptions}
 */
export async function loadFile<
	RowShape extends Record<string, unknown>,
>(fileConfig: FileConfig<keyof RowShape & string, RowShape>, options?: LoadFileOptions): Promise<Data<RowShape>> {
	const optionsWithDefaults: LoadFileOptions = Object.assign({}, defaultOptions, options ?? {});

	const response = await fetch(fileConfig.path);

	if (response.ok) {
		const data = await response.text();

		const rows = parseCSV(data);
		const processedData = processData(rows, fileConfig, optionsWithDefaults);
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
>(rows: readonly string[][], fileConfig: FileConfig<ColName, RowShape>, options: LoadFileOptions): Data<RowShape> {
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
	const typedRows: RowShape[] = namedRows.map((row, i) => {
		const typedRow: Partial<RowShape> = {};

		for (const colName in row) {
			const transformFn = fileConfig.cols[colName][1];

			// These conditions are intended to help when TypeScript isn't being used
			if (transformFn === types.array) {
				throw new Error(`The 'array' type function cannot be used directly. Please pass a 'separator' argument.`);
			} else if (transformFn === types.booleanCustom) {
				throw new Error(`The 'booleanCustom' type function cannot be used directly. Please pass 'truthy' and 'falsey' arguments.`);
			// @ts-expect-error This check is only intended to catch errors if an incorrectly typed value is passed
			} else if (transformFn === types.enumValue) {
				throw new Error(`The 'enumValue' type function cannot be used directly. Please pass an 'enums' argument.`);
			}

			// Type functions will throw an error if their assumptions are violated
			try {
				typedRow[colName as ColName] = transformFn(row[colName]);
			} catch (e) {
				if (e instanceof Error) {
					const locationIdentifier = `File: ${fileConfig.path}, Row: ${i}, Column: ${colName}`;
					const message = `${e.message} (${locationIdentifier})`;

					if (options.strict) {
						console.error(message);
					} else {
						console.warn(message);
					}
				}

				if (options.strict) {
					throw e;
				}
			}
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

	const data = new Data(typedRows, fileConfig.aliases);

	return data;
}

/**
 * Converts a map of column names like the one that can be provided as part of a {@linkcode FileConfig} object,
 * transforming each property according to the same rules as {@linkcode getColNumber}.
 *
 * If any of those transformations results in `null`, the property will be removed from the result.
 *
 * @param colsConfig - A map of column names to their indices
 */
export function getColNumbers<ColName extends string>(colsConfig: Record<ColName, readonly [string | number, ...unknown[]]>): Record<ColName, number> {
	const entries = Object.entries<typeof colsConfig[keyof typeof colsConfig]>(colsConfig);

	const mappedEntries = entries.map(([name, [index]]) => {
		const colNumber = getColNumber(index);

		if (colNumber !== null) {
			return [name, colNumber] as const;
		} else {
			return null;
		}
	}).filter((el): el is NonNullable<typeof el> => Boolean(el));

	const cols = Object.fromEntries(mappedEntries) as Record<ColName, number>;
	return cols;
}

/**
 * Convert a string of the format used as column headings by spreadsheet software like
 * Microsoft Excel into 0-indexed numbers.
 *
 * For example `'A'` would be converted to `0`, whereas `'ZE'` would be converted to `680`.
 * This is case insensitive.
 *
 * If a positive integer is passed, it will be returned unchanged.
 *
 * Any other number, or any string containing an invalid character, will instead be converted to `null`.
 */
export function getColNumber(index: number | string): number | null {
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

/**
 * This function allows {@linkcode Array.prototype.filter} to be used on a {@linkcode Data} object
 * while respecting a data set's aliases.
 *
 * It takes two arguments, which can each be either a single value or an array of values.
 * If any value in both of these arguments is either a direct match or are aliases of one another,
 * then the result will be `true`. Otherwise, the result will be `false`.
 *
 * Filtering can also be done without this function, when working with data that has no aliases, or
 * filtering by columns that don't contain string values.
 */
export function matchWithAlias(testValue: unknown, matchValue: unknown, aliases?: readonly string[][]): boolean {
	// Convert single values to arrays of length 1 to make them easier to work with consistently
	const testValues: unknown[] = Array.isArray(testValue) ? testValue : [testValue];
	const matchValues: unknown[] = Array.isArray(matchValue) ? matchValue : [matchValue];

	return testValues.some(
		(testValue) => matchValues.some(
			(matchValue) => matchWithAliasSingle(testValue, matchValue, aliases)
		)
	);
}

/**
 * Checks if two values match, optionally taking a set of aliases where groups of strings are treated as equal.
 */
function matchWithAliasSingle(valueA: unknown, valueB: unknown, aliases?: readonly string[][]): boolean {
	if (valueA === valueB) {
		return true;
	}

	if (
		aliases &&
		typeof valueA === 'string' &&
		typeof valueB === 'string'
	) {
		for (const aliasGroup of aliases) {
			if (aliasGroup.includes(valueA) && aliasGroup.includes(valueB)) {
				return true;
			}
		}
	}

	return false;
}

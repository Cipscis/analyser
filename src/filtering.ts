import { AnalyserRows } from './AnalyserRows';
import { Aliases } from './Aliases';

type FilterInput = ((value: any) => boolean) | any[] | Exclude<any, []>

interface FilterFunction {
	(colIndex: number, values: FilterInput): (row: any[]) => boolean
}

/**
 * Creates a function that remembers a set of aliases, and can be called
 * to create a function that can be used with Array.prototype.filter to
 * use that alias when filtering a set of data using _applyFilter.
 *
 * @param  {Aliases} aliases - The aliases to be embedded in this filter function.
 *
 * @return {FilterFunction} - A function that can be used with Array.prototype.filter.
 */
function createFilterFn(aliases?: Aliases): FilterFunction {
	const by = function (colIndex: number, values: FilterInput) {
		const applyFilterToRow = function (row: any[]) {
			return _applyFilter(row, colIndex, values, aliases);
		};

		return applyFilterToRow;
	};

	return by;
}

/**
 * Applies a filter to a specific row, looking at a specified column index
 * and checking its value against either a specific value, a set of values,
 * or a function.
 *
 * If the value or values being checked against are strings, a set of
 * aliases can be used as well.
 *
 * @param  {any[]} row - An AnalyserRows row to apply the filter to.
 * @param  {number} colIndex - The index of the column to filter by.
 * @param  {((any) => boolean) | any[] | any} values - The value, values,
 * or function to use to apply the filter.
 * @param  {Aliases} [aliases] - A set of aliases to use when matching
 * the value against one or more strings.
 *
 * @return {boolean}
 */
function _applyFilter(row: any[], colIndex: number, values: (value: any) => boolean): boolean
function _applyFilter(row: any[], colIndex: number, values: any[] | Exclude<any, []>, aliases?: Aliases): boolean
function _applyFilter(row: any[], colIndex: number, values: FilterInput, aliases?: Aliases): boolean {
	if (typeof values === 'function') {
		return values(row[colIndex]);
	}

	if (!Array.isArray(values)) {
		values = [values];
	}

	const cell = row[colIndex];
	let cellValues;

	if (Array.isArray(cell)) {
		cellValues = cell;
	} else {
		cellValues = [cell];
	}

	for (let cellValue of cellValues) {
		for (let value of values) {
			if (_matchAlias(value, cellValue, aliases)) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Checks if the value of a cell matches the value passed,
 * optionally taking one or more sets of aliases to match.
 *
 * @param  {any} cell [description]
 * @param  {any} value [description]
 * @param  {Aliases} aliases [description]
 *
 * @return {boolean} [description]
 */
function _matchAlias(cell: any, value: any, aliases?: Aliases): boolean {
	if (cell === value) {
		return true;
	}

	if (aliases && typeof cell === 'string' && typeof value === 'string') {
		for (let key in aliases) {
			const aliasSet = aliases[key];
			for (let aliasList of aliasSet) {
				if (aliasList.includes(cell) && aliasList.includes(value)) {
					return true;
				}
			}
		}
	}

	return false;
}

export {
	createFilterFn,

	FilterFunction,
};

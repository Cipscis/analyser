import { AnalyserRows } from './AnalyserRows.js';
import { Aliases } from './Aliases.js';

type FilterInput = ((value: any) => boolean) | any[] | Exclude<any, []>

/**
 * A function used by Array.prototype.filter
 */
interface FilterResolver {
	(val: any, index: number, arr: any[]): boolean,
}

/**
 * A FilterResolver that can be extended using FilterResolverExtender methods
 */
interface ExtensibleFilterResolver extends FilterResolver {
	andBy: FilterResolverExtender,
	orBy: FilterResolverExtender,
}

/**
 * A function that either creates a new FilterResolver or extends and existing one, embedding information about the column to look at and the values to match.
 */
interface FilterResolverExtender {
	(colIndex: number, values: FilterInput): ExtensibleFilterResolver,
}

/**
 * Creates a function that remembers a set of aliases, and can be called
 * to create a function that can be used with Array.prototype.filter to
 * use that alias when filtering a set of data using _applyFilter.
 *
 * @param  {Aliases} [aliases] - The aliases to be embedded in this filter function.
 *
 * @return {FilterResolver} - A function that can be used with Array.prototype.filter.
 */
function createFilterFn(aliases?: Aliases): FilterResolverExtender {
	const by = function (colIndex: number, values: FilterInput) {
		const applyFilterToRow: FilterResolver = function (row, index, arr) {
			return _applyFilter(row, colIndex, values, aliases);
		};

		const extendedApplyFilterToRow = _extendFilterFn(applyFilterToRow, aliases);

		return extendedApplyFilterToRow;
	};

	return by;
}

/**
 * Extend a FilterResolver into an ExtensibleFilterResolver, including embedding an optional set of Aliases.
 *
 * @param  {FilterResolver} filterResolver - The FilterResolver function to extend.
 * @param  {Aliases} [aliases] - The Aliases to embed in the ExtensibleFilterResolver being created.
 *
 * @return {ExtensibleFilterResolver} - An extended version of the initial FilterResolver.
 */
function _extendFilterFn(filterResolver: FilterResolver, aliases?: Aliases): ExtensibleFilterResolver {
	const extendedFilterResolver = filterResolver as ExtensibleFilterResolver;

	extendedFilterResolver.andBy = function (colIndex: number, values: FilterInput) {
		const newFilterResolver: FilterResolver = function (row, index, arr) {
			return filterResolver(row, index, arr) && _applyFilter(row, colIndex, values, aliases);
		};

		const newExtendedFilterResolver = _extendFilterFn(newFilterResolver, aliases);
		return newExtendedFilterResolver;
	};

	extendedFilterResolver.orBy = function (colIndex: number, values: FilterInput) {
		const newFilterResolver: FilterResolver = function (row, index, arr) {
			return filterResolver(row, index, arr) || _applyFilter(row, colIndex, values, aliases);
		};

		const newExtendedFilterResolver = _extendFilterFn(newFilterResolver, aliases);
		return newExtendedFilterResolver;
	};

	return extendedFilterResolver;
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
 * @param  {any} cell - The value of a cell to check.
 * @param  {any} value - The value being matched against.
 * @param  {Aliases} aliases - The aliases to use when matching the value.
 *
 * @return {boolean} - Whether or not the value matched.
 */
function _matchAlias(cell: any, value: any, aliases?: Aliases): boolean {
	if (cell === value) {
		return true;
	}

	if (aliases && typeof cell === 'string' && typeof value === 'string') {
		for (let aliasList of aliases) {
			if (aliasList.includes(cell) && aliasList.includes(value)) {
				return true;
			}
		}
	}

	return false;
}

export {
	createFilterFn,

	FilterResolverExtender,
	ExtensibleFilterResolver,
};

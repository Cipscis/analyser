// This type actually just resolves to `unknown`, which isn't really correct.
// It's intended to to only allow functions of the form (value: unknown) => boolean
// and 1D arrays, but it needs to be able to accept values of type `unknown`.
// This shortcoming is accounted for by a type check that potentially throws a TypeError
type FilterInput = ((value: unknown) => boolean) | unknown[] | Exclude<unknown, []>

/**
 * A function used by Array.prototype.filter
 */
interface FilterResolver {
	(val: unknown[], index: number, arr: unknown[][]): boolean,
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
 */
function createFilterFn(aliases?: string[][]): FilterResolverExtender {
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
 * Extend a FilterResolver into an ExtensibleFilterResolver, including embedding an optional set of aliases.
 */
function _extendFilterFn(filterResolver: FilterResolver, aliases?: string[][]): ExtensibleFilterResolver {
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
 */
function _applyFilter(row: unknown[], colIndex: number, values: FilterInput, aliases?: string[][]): boolean {
	if (typeof values === 'function') {
		const valueMatch: unknown = values(row[colIndex]);

		if (typeof valueMatch === 'boolean') {
			return valueMatch;
		} else {
			throw new TypeError(`The \`by\` filter method only accepts a function for its \`values\` argument if it returns a boolean value.`);
		}
	}

	const valuesArr = Array.isArray(values) ? values as unknown[] : [values];

	const cell = row[colIndex];
	const cellValues = Array.isArray(cell) ? cell as unknown[] : [cell];

	for (const cellValue of cellValues) {
		for (const value of valuesArr) {
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
 */
function _matchAlias(cell: unknown, value: unknown, aliases?: string[][]): boolean {
	if (cell === value) {
		return true;
	}

	if (aliases && typeof cell === 'string' && typeof value === 'string') {
		for (const aliasList of aliases) {
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

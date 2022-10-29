import { Data } from './Data.js';

type Primitive = number | string | boolean | bigint | symbol | null | undefined;

type FilterInput<T> = ((value: T) => boolean) | T[] | Primitive;

/**
 * A function used by `Data.prototype.filter`
 */
type FilterResolver<ColName extends string, RowShape extends Record<ColName, unknown>> = (value: RowShape, index: number, Data: Data<RowShape>) => boolean;

/**
 * A `FilterResolveer` that can be extended using `FilterResolverExtender` methods
 */
type ExtensibleFilterResolver<
	ColName extends string,
	RowShape extends Record<ColName, unknown>
> = FilterResolver<ColName, RowShape> & {
	andBy: FilterResolverExtender<ColName, RowShape>;
	orBy: FilterResolverExtender<ColName, RowShape>;
};

/**
 * A function that either creates a new `FilterResolver` or extends an existing one, embedding information about the column to look at and the matching criteria.
 */
export type FilterResolverExtender<
	ColName extends string,
	RowShape extends Record<ColName, unknown>
> = (colName: ColName, values: FilterInput<RowShape[ColName]>) => ExtensibleFilterResolver<ColName, RowShape>;

/**
 * Creates a function that can be used as a shorthand to construct complex filters using `Data.prototype.filter`, optionally baking in a set of string aliases.
 */
export function createFilterFn<
	ColName extends string,
	RowShape extends Record<ColName, unknown>
>(aliases?: string[][]): FilterResolverExtender<ColName, RowShape> {
	return function by(colName, values) {
		const applyFilterToRow: FilterResolver<ColName, RowShape> = function applyFilterToRow(row, index, data) {
			return applyFilter(row, colName, values, aliases);
		};

		const extendedApplyFilterToRow = extendFilterFn<ColName, RowShape>(applyFilterToRow, aliases);

		return extendedApplyFilterToRow;
	};
}

/**
 * Extends a base `FilterResolver` function with `andBy` and `orBy` methods, so it can be used to construct complex filters.
 */
function extendFilterFn<
	ColName extends string,
	RowShape extends Record<ColName, unknown>
>(filterResolver: FilterResolver<ColName, RowShape>, aliases?: string[][]): ExtensibleFilterResolver<ColName, RowShape> {
	const extendedFilterResolver = Object.assign(filterResolver, {
		andBy(colName: ColName, values: FilterInput<RowShape[ColName]>) {
			const newFilterResolver: FilterResolver<ColName, RowShape> = (row, index, data) => {
				return filterResolver(row, index, data) && applyFilter(row, colName, values, aliases);
			};

			const newExtendedFilterResolver = extendFilterFn<ColName, RowShape>(newFilterResolver, aliases);
			return newExtendedFilterResolver;
		},

		orBy(colName: ColName, values: FilterInput<RowShape[ColName]>) {
			const newFilterResolver: FilterResolver<ColName, RowShape> = (row, index, data) => {
				return filterResolver(row, index, data) || applyFilter(row, colName, values, aliases);
			};

			const newExtendedFilterResolver = extendFilterFn<ColName, RowShape>(newFilterResolver, aliases);
			return newExtendedFilterResolver;
		},
	});

	return extendedFilterResolver;
}

/**
 * Applies a single `FilterInput` to a row.
 */
function applyFilter<
	ColName extends string,
	RowShape extends Record<ColName, unknown>
>(row: RowShape, colName: ColName, values: FilterInput<RowShape[ColName]>, aliases?: string[][]) {
	if (typeof values === 'function') {
		return values(row[colName]);
	}

	const valuesArr: unknown[] = Array.isArray(values) ? values : [values];

	const cellValue = row[colName];
	const cellValues: unknown[] = Array.isArray(cellValue) ? cellValue : [cellValue];

	for (const cellValue of cellValues) {
		for (const value of valuesArr) {
			if (matchWithAlias(value, cellValue, aliases)) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Checks if two values match, optionally taking a set of aliases where groups of strings are treated as equal.
 */
function matchWithAlias(valueA: unknown, valueB: unknown, aliases?: string[][]): boolean {
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

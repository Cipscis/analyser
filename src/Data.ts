import { matchWithAlias } from './file-processing.js';

import { DataGroup } from './DataGroup.js';

import { InnerType } from './util.js';

// Type-only imports to make symbols available to JSDoc.
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { FileConfig } from './FileConfig.js';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { loadFile } from './file-processing.js';

export interface Data<RowShape extends Record<string, unknown>> {
	filter(...args: Parameters<Array<RowShape>['filter']>): Data<RowShape>;
}

/**
 * This class extends the native {@linkcode Array} class. For most purposes, it can be treated
 * the same as any regular `Array`, for example by calling methods such as {@linkcode Array.prototype.filter}.
 *
 * The key difference between `Data` and a native `Array` is that, if the data was processed with a set
 * of {@link FileConfig.aliases aliases}, these aliases will be preserved in the {@linkcode Data.aliases aliases}
 * property.
 *
 * @see {@linkcode loadFile} for how to create `Data` objects.
 * @see {@linkcode matchWithAlias} for how to filter string data in a way that respects aliases
 */
export class Data<RowShape extends Record<string, unknown>> extends Array<RowShape> {
	/**
	 * If {@linkcode loadFile} was called with a {@linkcode FileConfig} that contained an
	 * {@linkcode FileConfig.aliases aliases} property, those aliases are preserved here.
	 * This makes them available to be used with the {@linkcode matchWithAlias} method.
	 */
	aliases?: string[][];

	constructor(source?: number | Array<RowShape>, aliases?: string[][]) {
		if (Array.isArray(source)) {
			super(source.length);
			for (let i = 0; i < source.length; i++) {
				this[i] = source[i];
			}
		} else if (typeof source === 'number') {
			super(source);
		} else {
			super();
		}

		if (aliases) {
			this.aliases = aliases;
		}
	}

	/**
	 * This method is used to add a new row to a `Data` object.
	 *
	 * To ensure proper type inference when working with TypeScript, this returns a new `Data`
	 * object that contains the new column.
	 *
	 * There are two overloads available. The primary overload relies on a `creator` function,
	 * which works similarly to a function passed to {@linkcode Array.prototype.map}. This
	 * `creator` function takes a single row object and that row's index, and creates the valueu
	 * that row should have in the new column.
	 *
	 * The second overload simply passes a newly constructed column in its entirety, as an array.
	 * This array must be of the same length as the `Data` object being added to.
	 */
	addCol<ColName extends string, T>(colName: ColName, creator: (row: RowShape, index: number, data: RowShape[]) => T): Data<RowShape & Record<ColName, T>>
	addCol<ColName extends string, T>(colName: ColName, newRow: T[]): Data<RowShape & Record<ColName, T>>
	addCol<ColName extends string, T>(colName: ColName, creator: ((row: RowShape, index: number, data: RowShape[]) => T) | T[]) {
		if (Array.isArray(creator)) {
			const newRow = creator;
			if (this.length !== newRow.length) {
				throw new Error(`New column of length ${newRow.length} cannot be added. It must be of length ${this.length}.`);
			}

			const newRows = this.map((row, i, data) => {
				return Object.assign(
					{},
					row,
					{ [colName]: newRow[i] },
				);
			});

			return new Data(newRows);
		}

		const newRows = this.map((row, i, data) => {
			return Object.assign(
				{},
				row,
				{ [colName]: creator(row, i, data) },
			);
		});

		return new Data(newRows);
	}

	/**
	 * This method is used for grouping rows in a {@linkcode Data} object.
	 *
	 * These groups can then be used to produce summaries of the data, which in turn can be used to create graphs.
	 *
	 * This method effectively has any {@linkcode FileConfig.aliases aliases} baked in, with any values
	 * in a set of aliases treated as though they were the first value in that set. That first value does not need
	 * to appear in the data, but it will always be used in any {@linkcode DataGroup} created by this method.
	 *
	 * `groupBy` has three overrides.
	 *
	 * When grouping by discrete data, thie first override that only specifies a `colName` should always be used.
	 * The other two overrides provide different methods for dividing continuous data into groups.
	 *
	 * If the `numGroups` argument is provided with a number, continuous data will be split into that many groups
	 * of the same range. For example, if the data ranges from `0` to `100` and the `numGroups` argument is `5`,
	 * the first group would contain data from `0` to `20`.
	 *
	 * Otherwise, the `splitPoints` argument can be provided with an array of numbers, which will be used as the
	 * points where the groups will be split.
	 *
	 * For both of the continuous data overloads, there is an optional `right` argument that determines which end
	 * of a group is open. If `right` is `true` (its default value), then values equal to the upper limit of a group
	 * will be included. Otherwise, values equal to a group's lower limit will be included instead.
	 *
	 * However, the first and last groups will always include values at their outer boundaries, since they will be
	 * determined based on the minimum and maximum values in the data set.
	 */
	groupBy<ColName extends keyof RowShape>(colName: ColName): DataGroup<RowShape, ColName>
	groupBy<ColName extends keyof RowShape>(colName: ColName, numGroups: number, right?: boolean): DataGroup<RowShape, ColName>
	groupBy<ColName extends keyof RowShape>(colName: ColName, splitPoints: number[], right?: boolean): DataGroup<RowShape, ColName>
	groupBy<ColName extends keyof RowShape>(colName: ColName, splitting?: number | number[], right: boolean = true): DataGroup<RowShape, ColName> {
		if (typeof splitting === 'undefined') {
			// Treat data without any splitting instructions as discrete
			return groupDiscreteData(this, colName);
		} else {
			return groupContinuousData(this, colName, splitting, right);
		}
	}
}

/**
 * Collects all values of a discrete column in a {@linkcode Data} object, including the inner values of array types
 */
function collectEnums<RowShape extends Record<string, unknown>, ColName extends keyof RowShape>(data: Data<RowShape>, colName: ColName): Set<InnerType<RowShape[ColName]>> {
	const enums = new Set<InnerType<RowShape[ColName]>>();

	// First, collect all values
	for (const row of data) {
		const cellValue = row[colName];

		if (Array.isArray(cellValue)) {
			for (const value of cellValue) {
				// Type assertion is safe here since `InnerType<T>` resolves to the type of an array's elements' values if `T` is an array
				enums.add(value as InnerType<typeof cellValue>);
			}
		} else {
			// Type assertion is safe here since `InnerType<T>` resolves to `T` if it's not an array
			enums.add(cellValue as InnerType<typeof cellValue>);
		}
	}

	// Then, if there are aliases, remove any values that are non-canonical members of alias groups
	if (data.aliases) {
		for (const val of enums) {
			if (typeof val === 'string') {
				// If the value is a string in one or more alias sets,
				// ensure those sets will be used for grouping and
				// ensure only canonical values will be checked directly.

				/** If the value appears in at least one alias list and is **not** the canonical value */
				let isNonCanonical = false;

				/** If the value appears in at least one alias list and **is** the canonical value */
				let isCanonical = false;

				for (const aliasGroup of data.aliases) {
					// This type assertion is safe since, if we've reached this point, `string` extends `InnerType<RowShape[ColName]>`
					const canonicalAliasMember = aliasGroup[0] as InnerType<RowShape[ColName]>;
					if (aliasGroup.includes(val)) {
						if (val === canonicalAliasMember) {
							isCanonical = true;
						} else {
							isNonCanonical = true;

							// Remember the canonical value
							if (enums.has(canonicalAliasMember) === false) {
								enums.add(canonicalAliasMember);
							}
						}
					}
				}

				// If the value is one one or more alias sets, but is never the canonical value,
				// then remove it from the set of enums to use for grouping.
				if (isCanonical === false && isNonCanonical === true) {
					enums.delete(val);
				}
			}
		}
	}

	return enums;
}

/**
 * Create a {@linkcode DataGroup} for a discrete column of a {@linkcode Data} object
 */
function groupDiscreteData<RowShape extends Record<string, unknown>, ColName extends keyof RowShape>(data: Data<RowShape>, colName: ColName): DataGroup<RowShape, ColName> {
	// First, collect enums
	const enums = collectEnums(data, colName);

	const group = new DataGroup<RowShape, ColName>();

	// Then, interate through each enum and filter rows into groups
	for (const val of enums) {
		const matchingRows = data.filter((row) => matchWithAlias(row[colName], val, data.aliases));
		group.set(val, matchingRows);
	}

	return group;
}

/**
 * Create a {@linkcode DataGroup} for a continuous column of a {@linkcode Data} object
 */
function groupContinuousData<RowShape extends Record<string, unknown>, ColName extends keyof RowShape>(data: Data<RowShape>, colName: ColName, splitting: number | number[], right?: boolean): DataGroup<RowShape, ColName> {
	const enums = collectEnums(data, colName);

	// Create the limits for each set
	const setLimits: [number, number][] = [];
	if (typeof splitting === 'number') {
		// Create splitting number of groups based on values retrieved

		if (Number.isInteger(splitting) === false || splitting < 2) {
			throw new RangeError(`The 'numGroups' argument must be an integer greater than 1.`);
		}

		// Sets are unordered, so create and sort an array (ascending)
		const enumArr = [...enums];
		const isNumber = (x: unknown): x is number => typeof x === 'number';
		const isNumArr = (arr: unknown[]): arr is number[] => arr.every(isNumber);

		if (isNumArr(enumArr)) {
			const values = enumArr.sort((a: number, b: number) => a - b);

			const [min, max] = [values[0], values[values.length-1]];

			const setSize = (max - min) / splitting;
			for (let i = 0; i < splitting; i++) {
				const setMin = min + i * setSize;
				const setMax = min + (i+1) * setSize;

				setLimits.push([setMin, setMax]);
			}
		} else {
			throw new TypeError(`Cannot split values based on a number unless each of those values is a number.`);
		}

		// The first and last sets should be unbounded
		setLimits[0][0] = -Infinity;
		setLimits[setLimits.length - 1][1] = Infinity;
	} else if (Array.isArray(splitting)) {
		if (splitting.length === 0) {
			throw new RangeError(`At least one number is required for the 'splitPoints' argument.`);
		} else if (splitting.every((val) => typeof val === 'number') === false) {
			throw new TypeError(`All 'splitPoints' must be numbers.`);
		}

		// Ensure splitting values are ordered (ascending)
		const splitValues = splitting.concat().sort((a, b) => a - b);

		// Outer bounds will be -Infinity and Infinity
		setLimits.push([-Infinity, splitValues[0]]);

		for (let i = 0; i < splitValues.length-1; i++) {
			setLimits.push([splitValues[i], splitValues[i+1]]);
		}

		setLimits.push([splitValues[splitValues.length-1], Infinity]);
	} else {
		throw new TypeError(`Invalid argument type: ${typeof splitting}`);
	}

	// Group rows based on set limits
	const group = new DataGroup<RowShape, ColName>();
	for (const set of setLimits) {
		let setName = '';
		let filterFn: (row: RowShape) => boolean;

		if (right) {
			if (set[0] !== -Infinity) {
				setName += `${set[0]} < `;
			}
			setName += `x`;
			if (set[1] !== Infinity) {
				setName += ` <= ${set[1]}`;
			}

			filterFn = (row) => {
				const cellValue = row[colName];
				return typeof cellValue === 'number' &&
					set[0] < cellValue &&
					cellValue <= set[1];
			};
		} else {
			if (set[0] !== -Infinity) {
				setName += `${set[0]} <= `;
			}
			setName += `x`;
			if (set[1] !== Infinity) {
				setName += ` < ${set[1]}`;
			}

			filterFn = (row) => {
				const cellValue = row[colName];
				return typeof cellValue === 'number' &&
					set[0] <= cellValue
					&& cellValue < set[1];
			};
		}

		const matchingRows = data.filter(filterFn);

		// TODO: Need to determine how to tell TypeScript when a group will be indexed by a string
		// @ts-expect-error This is temporary
		group.set(setName, matchingRows);
	}

	return group;
}

import { AnalyserRows } from './AnalyserRows.js';
import { FilterResolverExtender, ExtensibleFilterResolver } from './filtering.js';

import { AnalyserGroup } from './AnalyserGroup.js';

interface Grouper {
	(rows: AnalyserRows, colNum: number): AnalyserGroup
	(rows: AnalyserRows, colNum: number, numGroups: number, right?: boolean): AnalyserGroup
	(rows: AnalyserRows, colNum: number, splitPoints: number[], right?: boolean): AnalyserGroup
}

/**
 * Creates a function that uses a FilterResolverExtender with an embedded
 * set of aliases, to create a summarisable group of AnalyserRows split
 * based on the specified column.
 */
function createGroupFn (by: FilterResolverExtender, aliases?: string[][]): Grouper {
	const grouperFn: Grouper = function (rows: AnalyserRows, colNum: number, splitting?: number | number[], right: boolean = true): AnalyserGroup {
		// First, collect enums
		const enums: Set<unknown> = new Set();
		for (const row of rows) {
			const cellValue = row[colNum];

			if (Array.isArray(cellValue)) {
				for (const value of cellValue) {
					enums.add(value);
				}
			} else {
				enums.add(cellValue);
			}
		}

		if (typeof splitting === 'undefined') {
			// Treat data as discrete

			if (aliases) {
				for (const val of enums) {
					if (typeof val === 'string') {
						// If the value is a string in one or more alias sets,
						// ensure those sets will be used for grouping and
						// ensure only canonical values will be checked directly.

						/** If the value appears in at least one alias list and is **not** the canonical value */
						let isNonCanonical = false;

						/** If the value appears in at least one alias list and **is** the canonical value */
						let isCanonical = false;

						for (const aliasList of aliases) {
							if (aliasList.includes(val)) {
								if (aliasList[0] === val) {
									isCanonical = true;
								} else {
									isNonCanonical = true;

									// Remember the canonical value
									if (enums.has(aliasList[0]) === false) {
										enums.add(aliasList[0]);
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

			// Then, interate through each enum and filter rows into groups
			const group = new AnalyserGroup();
			for (const val of enums) {
				const matchingRows = rows.filter(by(colNum, val));
				group.set(val, matchingRows);
			}
			return group;
		} else {
			// Treat data as continuous

			// Create the limits for each set
			const setLimits: [number, number][] = [];
			if (typeof splitting === 'number') {
				// Create splitting number of groups based on values retrieved

				if (Number.isInteger(splitting) === false || splitting < 2) {
					throw new RangeError(`The 'numGroups' argument must be an integer greater than 1.`);
				}

				// Sets are unordered, so create and sort an array (ascending)
				const enumArr = new Array(...enums);

				if (enumArr.every((x: unknown): x is number => typeof x === 'number')) {
					const values = enumArr.sort((a, b) => a - b);

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
			const group = new AnalyserGroup({ discrete: false });
			for (const set of setLimits) {
				let setName = '';
				let filterFn: ExtensibleFilterResolver;

				if (right) {
					if (set[0] !== -Infinity) {
						setName += `${set[0]} < `;
					}
					setName += `x`;
					if (set[1] !== Infinity) {
						setName += ` <= ${set[1]}`;
					}

					filterFn = by(colNum, (val: number) => set[0] < val && val <= set[1]);
				} else {
					if (set[0] !== -Infinity) {
						setName += `${set[0]} <= `;
					}
					setName += `x`;
					if (set[1] !== Infinity) {
						setName += ` < ${set[1]}`;
					}

					filterFn = by(colNum, (val: number) => set[0] <= val && val < set[1]);
				}

				const matchingRows = rows.filter(filterFn);

				group.set(setName, matchingRows);
			}

			return group;
		}
	};

	return grouperFn;
}

export {
	createGroupFn,

	Grouper,
};
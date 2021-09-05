import { AnalyserRows } from './AnalyserRows.js';
import { Aliases } from './Aliases.js';
import { FilterResolverExtender } from './filtering.js';

import { AnalyserGroup } from './AnalyserGroup.js';

interface Grouper {
	(rows: AnalyserRows, colNum: number): AnalyserGroup
}

/**
 * Creates a function that uses a FilterResolverExtender with an embedded
 * set of aliases, to create a summarisable group of AnalyserRows split
 * based on the specified column.
 *
 * @param  {FilterResolverExtender} by - The function used to determine which
 * rows belong to which group.
 *
 * @return {Grouper} - A function for grouping AnalyserRows.
 */
function createGroupFn (by: FilterResolverExtender, aliases?: Aliases): Grouper {
	const grouperFn: Grouper = function (rows: AnalyserRows, colNum: number): AnalyserGroup {
		// Ignore aliases for now, and don't worry about splitting

		// First, collect enums
		const enums: Set<any> = new Set();
		for (let row of rows) {
			const cellValue = row[colNum];

			if (Array.isArray(cellValue)) {
				for (let value of cellValue) {
					enums.add(value);
				}
			} else {
				enums.add(cellValue);
			}
		}

		if (aliases) {
			for (let val of enums) {
				// If the value is in one or more alias sets,
				// ensure those sets will be used for grouping and
				// ensure only canonical values will be checked directly.

				/** @type {boolean} If the value appears in at least one alias list and is **not** the canonical value */
				let isNonCanonical = false;

				/** @type {boolean} If the value appears in at least one alias list and **is** the canonical value */
				let isCanonical = false;

				for (let aliasList of aliases) {
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

		// Then, interate through each enum and filter rows into groups
		const group = new AnalyserGroup();
		for (let val of enums) {
			const matchingRows = rows.filter(by(colNum, val)) as AnalyserRows;
			group.set(val, matchingRows);
		}
		return group;
	};

	return grouperFn;
}

export {
	createGroupFn,

	Grouper,
};
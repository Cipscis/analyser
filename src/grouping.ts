import { AnalyserRows } from './AnalyserRows.js';
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
function createGroupFn (by: FilterResolverExtender): Grouper {
	const grouperFn: Grouper = function (rows: AnalyserRows, colNum: number): AnalyserGroup {
		// Ignore aliases for now, and don't worry about splitting

		// First, collect enums
		const enums: Set<any> = new Set();
		for (let row of rows) {
			enums.add(row[colNum]);
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
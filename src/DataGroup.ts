import { Data } from './Data.js';

import { InnerType } from './util.js';

/**
 * A function for summarising a set of `Data`
 */
// TODO: Should we know more information about `G` and `T` now that we have `RowShape`?
 type Summariser<RowShape extends Record<string, unknown>, G = unknown, T = unknown> = (rows: Data<RowShape>, groupName: G) => T;

/**
  * A group of `Summariser` functions
  */
type Summarisers<SummaryName extends string, RowShape extends Record<string, unknown>> = Record<SummaryName, Summariser<RowShape>>;

// TODO: Should satisfy `Summarisers<string, Record<string, unknown>>`
const defaultSummarisers = {
	Count: ((rows: unknown[]) => rows.length),
} as const;
type DefaultSummaryName = keyof typeof defaultSummarisers;

/**
* A 2D array of the results of Summariser functions applied to an AnalyserGroup of Data,
* able to be printed to the console using `console.table`.
*
* After the first header row, each row represents a set of Data grouped by the value given in the first cell.
* After the first column, each column represents a summary of a group of Data. The name of the summary is given in the first cell.
*/
export type Summary<SummaryName extends string> = [[unknown, ...SummaryName[]], ...[unknown, ...unknown[]][]];

interface DataGroupOptions {
	discrete?: boolean,
}

export class DataGroup<RowShape extends Record<string, unknown>, ColName extends keyof RowShape> extends Map<InnerType<RowShape[ColName]>, Data<RowShape>> {
	#discrete: boolean;

	constructor(options?: DataGroupOptions) {
		super();

		if (typeof options?.discrete === 'boolean') {
			this.#discrete = options.discrete;
		} else {
			this.#discrete = true;
		}
	}

	/**
	 * Create a 2D summary array that can be printed using console.table.
	 */
	summarise(): Summary<DefaultSummaryName>
	summarise<SummaryName extends string>(summarisers: Summarisers<SummaryName, RowShape>): Summary<SummaryName>
	summarise<SummaryName extends string>(summarisersArg?: Summarisers<SummaryName, RowShape>): Summary<DefaultSummaryName> | Summary<SummaryName> {
		// If there was no argument, use a default value instead. This will affect the return type, as per the overloads
		const summarisers = summarisersArg ?? defaultSummarisers;

		const summaryNames = Object.keys(summarisers) as (DefaultSummaryName)[] | SummaryName[];
		const summaryHeaderRow = ['Value', ...summaryNames] as const;

		let summaryValueRows: [unknown, ...unknown[]][] = [];
		for (const [groupName, rows] of this.entries()) {
			const summaryRow: [unknown, ...unknown[]] = [groupName];

			for (const [, summariser] of Object.entries<Summariser<RowShape>>(summarisers)) {
				const rowSummary = summariser(rows, groupName);
				summaryRow.push(rowSummary);
			}

			summaryValueRows.push(summaryRow);
		}

		if (this.#discrete) {
			// Sort summary based on its values

			// Use basic Array.prototype.sort to sort numbers or strings, to use as a reference when sorting the summary
			const summaryValues = summaryValueRows.map((summaryRow) => summaryRow[0]);
			const summaryValuesSorted = summaryValues.sort();

			// Sort summary value rows using the sorted values as a reference
			summaryValueRows = summaryValueRows.sort((a, b) => summaryValuesSorted.indexOf(a[0]) - summaryValuesSorted.indexOf(b[0]));
		}

		const summary = [summaryHeaderRow, ...summaryValueRows];

		// Let the overloads tell TypeScript which type the summary actually is.
		// If there was no `summarisersArg` argument, it will be Summary<DefaultSummaryNames>,
		// otherwise the type T could be inferred so no default was necessary and it will be Summary<SummaryName>
		return summary as Summary<DefaultSummaryName> | Summary<SummaryName>;
	}
}

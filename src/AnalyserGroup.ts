import { AnalyserRows } from './AnalyserRows.js';

/**
 * A function for summarising a set of AnalyserRows
 */
type AnalyserSummariser<T = any, G = any> = (rows: AnalyserRows, groupName: G) => T;

/**
 * A group of AnalyserSummariser functions
 */
type AnalyserSummarisers<SummaryName extends string> = Record<SummaryName, AnalyserSummariser>;

const defaultSummarisers = {
	Count: (rows: AnalyserRows) => rows.length
} as const;
type DefaultSummaryName = keyof typeof defaultSummarisers;

/**
 * A 2D array of the results of AnalyserSummariser functions applied to an AnalyserGroup of AnalyserRows,
 * able to be printed to the console using `console.table`.
 *
 * After the first header row, each row represents a set of AnalyserRows grouped by the value given in the first cell.
 * After the first column, each column represents a summary of a group of AnalyserRows. The name of the summary is given in the first cell.
 */
export type AnalyserSummary<SummaryName extends string> = [[unknown, ...SummaryName[]], ...[any, ...any[]][]];

interface AnalyserGroupOptions {
	discrete?: boolean,
}

export class AnalyserGroup extends Map<any, AnalyserRows> {
	#discrete: boolean

	constructor(options?: AnalyserGroupOptions) {
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
	summarise(): AnalyserSummary<DefaultSummaryName>
	summarise<SummaryName extends string>(summarisers: AnalyserSummarisers<SummaryName>): AnalyserSummary<SummaryName>
	summarise<SummaryName extends string>(summarisersArg?: AnalyserSummarisers<SummaryName>): AnalyserSummary<DefaultSummaryName> | AnalyserSummary<SummaryName> {
		// If there was no argument, use a default value instead. This will affect the return type, as per the overloads
		const summarisers = summarisersArg ?? defaultSummarisers;

		const summaryNames = Object.keys(summarisers) as (DefaultSummaryName)[] | SummaryName[];
		const summaryHeaderRow = ['Value', ...summaryNames] as const;

		let summaryValueRows: [any, ...any[]][] = [];
		for (let [groupName, rows] of this.entries()) {
			const summaryRow: [any, ...any[]] = [groupName];

			for (let [, summariser] of Object.entries<AnalyserSummariser>(summarisers)) {
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
		// If there was no `summarisersArg` argument, it will be AnalyserSummary<DefaultSummaryNames>,
		// otherwise the type T could be inferred so no default was necessary and it will be AnalyserSummary<SummaryName>
		return summary as AnalyserSummary<DefaultSummaryName> | AnalyserSummary<SummaryName>;
	}
}

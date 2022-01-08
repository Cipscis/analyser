import { AnalyserRows } from './AnalyserRows.js';

interface AnalyserGroupOptions {
	discrete?: boolean,
}

export type AnalyserSummary<T extends string> = [['Value', ...T[]], ...[string, ...any[]][]];
type AnalyserSummariser = (rows: AnalyserRows) => any;

type ElementType<T> = T extends (infer U)[] ? U : never;

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
	summarise(): AnalyserSummary<'Count'>
	summarise<T extends string>(summarisers: Record<T, AnalyserSummariser>): AnalyserSummary<T>
	summarise<T extends string>(summarisersArg?: Record<T, AnalyserSummariser>): AnalyserSummary<'Count'> | AnalyserSummary<T> {
		// If there was no argument, use a default value instead. This will affect the return type, as per the overloads
		const summarisers: Record<T, AnalyserSummariser> | Record<'Count', AnalyserSummariser> = summarisersArg ?? { 'Count': (rows: AnalyserRows) => rows.length };

		const groupNames = Object.keys(summarisers) as T[] | ['Count'];
		const summaryHeaderRow: ['Value', ...T[]] | ['Value', 'Count'] = ['Value', ...groupNames];

		let summaryValueRows: [string, ...any[]][] = [];
		for (let [summariserName, rows] of this.entries()) {
			const summaryRow: ElementType<typeof summaryValueRows> = [summariserName];

			for (let [, summariser] of Object.entries<AnalyserSummariser>(summarisers)) {
				const rowSummary = summariser(rows);
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

		// Let the overloads tell TypeScript which type summary actually is.
		// If there was no `summarisersArg` argument, it will be AnalyserSummary<'Count'>,
		// otherwise the type T could be inferred so no default was necessary and it will be AnalyserSummary<T>
		return summary as AnalyserSummary<'Count'> | AnalyserSummary<T>;
	}
}

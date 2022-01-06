import { AnalyserRows } from './AnalyserRows.js';

interface AnalyserGroupOptions {
	discrete?: boolean,
}

export type AnalyserSummary = [['Value', ...string[]], ...[string, ...any[]][]];

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
	summarise(summarisers: { [key: string]: (rows: AnalyserRows) => any } = { 'Count': (rows) => rows.length }): AnalyserSummary {
		const summaryHeaderRow: ['Value', ...string[]] = ['Value', ...Object.keys(summarisers)];

		const summaryValueRows: [string, ...any[]][] = [];
		for (let [summariserName, rows] of this.entries()) {
			const summaryRow: ElementType<typeof summaryValueRows> = [summariserName];

			for (let [, summariser] of Object.entries(summarisers)) {
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
			const summaryValueRowsSorted = summaryValueRows.sort((a, b) => summaryValuesSorted.indexOf(a[0]) - summaryValuesSorted.indexOf(b[0]));

			// Rejoin header row with sorted value rows
			const summarySorted: AnalyserSummary = [summaryHeaderRow, ...summaryValueRowsSorted];

			return summarySorted;
		} else {
			const summary: AnalyserSummary = [summaryHeaderRow, ...summaryValueRows];

			return summary;
		}
	}
}

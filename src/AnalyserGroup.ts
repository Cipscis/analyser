import { AnalyserRows } from './AnalyserRows.js';

interface AnalyserGroupOptions {
	discrete?: boolean,
}

class AnalyserGroup extends Map<any, AnalyserRows> {
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
	summarise(summarisers: { [key: string]: (rows: AnalyserRows) => any } = { 'Count': (rows) => rows.length }): any[][] {
		const summary: any[][] = [];

		summary.push(['Value'].concat(Object.keys(summarisers)));

		for (let [val, rows] of this.entries()) {
			const summaryRow = [val];

			for (let [key, summariser] of Object.entries(summarisers)) {
				const rowSummary = summariser(rows);
				summaryRow.push(rowSummary);
			}

			summary.push(summaryRow);
		}

		if (this.#discrete) {
			// Sort summary based on its values

			// Split header and value rows, so value rows can be sorted independently
			const summaryHeaderRow = summary.slice(0, 1);
			const summaryValueRows = summary.slice(1);

			// Use basic Array.prototype.sort to sort numbers or strings, to use as a reference when sorting the summary
			const summaryValues = summaryValueRows.map((summaryRow) => summaryRow[0]);
			const summaryValuesSorted = summaryValues.sort();

			// Sort summary value rows using the sorted values as a reference
			const summaryValueRowsSorted = summaryValueRows.sort((a, b) => summaryValuesSorted.indexOf(a[0]) - summaryValuesSorted.indexOf(b[0]));

			// Rejoin header row with sorted value rows
			const summarySorted = summaryHeaderRow.concat(summaryValueRowsSorted);

			return summarySorted;
		} else {
			return summary;
		}
	}
}

export { AnalyserGroup };

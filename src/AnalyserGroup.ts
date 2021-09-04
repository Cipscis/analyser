import { AnalyserRows } from './AnalyserRows.js';

class AnalyserGroup extends Map<any, AnalyserRows> {
	/**
	 * Create a 2D summary array that can be printed using console.table.
	 *
	 * @param  {{ [key: string]: (rows: AnalyserRows) => any }} summarisers - An object containing summariser functions
	 * for reducing a group of AnalyserRows into a single value. The key for each summariser will be
	 * the heading of its column in the output table.
	 *
	 * @return {any[][]}
	 */
	summarise(summarisers: { [key: string]: (rows: AnalyserRows) => any }): any[][] {
		const summary: any[][] = [];

		summary.push([''].concat(Object.keys(summarisers)));

		for (let [val, rows] of this.entries()) {
			const summaryRow = [val];

			for (let [key, summariser] of Object.entries(summarisers)) {
				const rowSummary = summariser(rows);
				summaryRow.push(rowSummary);
			}

			summary.push(summaryRow);
		}

		return summary;
	}
}

export { AnalyserGroup };

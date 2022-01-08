import { AnalyserSummary } from '../AnalyserGroup.js';
import { ChartOptions } from './ChartOptions.js';

export type ChartData<T extends string> = {
	labels: string[],
	groupNames: T[],
	groups: number[][],
	colours: string[],

	min?: number,
	max?: number,
};

export function getChartData<T extends string>(summary: AnalyserSummary<T>, options?: ChartOptions): ChartData<T> {
	const [
		[, ...groupNames], // Ignore first 'Value' entry
		...valueRows
	] = summary;

	const labels = valueRows.map((row) => row[0]);

	// Transpose valueRows to get groups
	const valueGroups: any[][] = [];
	for (let i = 0; i < valueRows.length; i++) {
		// Start at j = 1 to ignore labels
		for (let j = 1; j < valueRows[i].length; j++) {
			if (typeof valueGroups[j] === 'undefined') {
				valueGroups[j] = [];
			}
			valueGroups[j][i] = valueRows[i][j]
		}
	}
	// This method has given us an empty element at index 0, so remove it
	valueGroups.splice(0, 1);

	// We can only graph values that are entirely numbers
	const numberValueGroups = valueGroups.filter(
		(group): group is number[] => group.every(
			(value): value is number => typeof value === 'number'
		)
	);

	// Filter out the same groups from the groupNames list
	const numberValueGroupNames = groupNames.filter(
		(groupName, index) => numberValueGroups.includes(valueGroups[index])
	);

	// TODO: Determine colours based on options, if possible
	const colours = numberValueGroupNames.map((groupName) => Math.random() > 0.5 ? 'red' : 'blue');

	const chartData: ChartData<T> = {
		labels,
		groupNames: numberValueGroupNames,
		groups: numberValueGroups,
		colours,
	};

	return chartData;
}

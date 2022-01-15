import { AnalyserSummary } from '../AnalyserGroup.js';
import { ChartOptions } from './ChartOptions.js';

export type ChartData<GroupName extends string = string> = {
	labels: string[],
	groupNames: GroupName[],
	groups: number[][],

	min?: number,
	max?: number,
};

export function getChartData<GroupName extends string>(summary: AnalyserSummary<GroupName>, options?: ChartOptions<GroupName>): ChartData<GroupName> {
	const [
		[, ...groupNames], // Ignore first 'Value' entry
		...valueRows
	] = summary;

	// Extract the labels and convert them to strings
	const labels = valueRows.map((row) => row[0] + '');

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

	// We can only graph groups if all their values are numbers
	const numberValueGroups = valueGroups.filter(
		(group): group is number[] => group.every(
			(value): value is number => typeof value === 'number'
		)
	);

	// Filter out the same groups from the groupNames list
	const numberValueGroupNames = groupNames.filter(
		(groupName, index) => numberValueGroups.includes(valueGroups[index])
	);

	const chartData: ChartData<GroupName> = {
		labels,
		groupNames: numberValueGroupNames,
		groups: numberValueGroups,
	};

	return chartData;
}

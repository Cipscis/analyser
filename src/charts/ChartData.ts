import { AnalyserSummary } from '../AnalyserGroup.js';
import { ChartOptions } from './ChartOptions.js';

export type ChartData<GroupName extends string = string> = {
	labels: string[],
	groupNames: GroupName[],
	groups: number[][],

	min?: number,
	max?: number,

	stacked?: boolean,
};

export function getChartData<GroupName extends string>(summary: AnalyserSummary<GroupName>, options?: ChartOptions<GroupName>): ChartData<GroupName> {
	const [[, ...groupNames]] = summary; // Ignore first 'Value' entry in first row
	let [, ...valueRows] = summary; // Ignore first row of group names

	// Extract the labels and convert them to strings
	let labels = valueRows.map((row) => row[0] + '');

	// If labels were limited on x axis options
	if (options?.x?.labels) {
		// Remove any labels not specified in the axis options
		for (let i = 0; i < labels.length; i++) {
			const label = labels[i];
			if (options.x.labels.includes(label) === false) {
				labels.splice(i, 1);
				valueRows.splice(i, 1);
				i -= i;
			}
		}

		// Go through specified labels, and if any weren't in the dataset then add empty data
		for (let i = 0; i < options.x.labels.length; i++) {
			const label = options.x.labels[i];
			if (labels.includes(label) === false) {
				const emptyData: [string, ...0[]] = [label, ...(new Array(valueRows[0].length-1)).fill(0)];
				labels.splice(i, 0, label);
				valueRows.splice(i, 0, emptyData);
			}
		}

		// Also update order of labels and value rows to match specified label order
		labels = options.x.labels; //
		valueRows = valueRows.sort((rowA, rowB) => {
			const labelA = rowA[0] + '';
			const indexA = labels.indexOf(labelA);

			const labelB = rowB[0] + '';
			const indexB = labels.indexOf(labelB);

			return indexA - indexB;
		});
	}

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

	// Filter out the same non-number groups from the groupNames list
	const numberValueGroupNames = groupNames.filter(
		(groupName, index) => numberValueGroups.includes(valueGroups[index])
	);

	const chartData: ChartData<GroupName> = {
		labels,
		groupNames: numberValueGroupNames,
		groups: numberValueGroups,
	};

	if (options && 'stacked' in options) {
		chartData.stacked = options.stacked;
	}

	return chartData;
}

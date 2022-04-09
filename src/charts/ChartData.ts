import { AnalyserSummary } from '../AnalyserGroup.js';
import { ChartOptions } from './ChartOptions.js';

/**
 * Types that can be coerced to `number`
 */
type NumberLike = number | string | Date;

export type ChartData<GroupName extends string = string> = {
	labels: NumberLike[],
	groupNames: GroupName[],
	groups: number[][],

	min?: number,
	max?: number,

	stacked?: boolean,
};

export function getChartData<GroupName extends string>(summary: AnalyserSummary<GroupName>, options?: ChartOptions<GroupName>): ChartData<GroupName> {
	const [[, ...groupNames]] = summary; // Ignore first 'Value' entry in first row
	let [, ...valueRows] = summary; // Ignore first row of group names

	// If all the values are dates or numbers, sort valueRows based on label then re-extract
	if (valueRows.every((row): row is [Date | number, ...unknown[]] => row[0] instanceof Date || typeof row[0] === 'number')) {
		valueRows = valueRows.sort((a, b) => +a[0] - +b[0]);
	}

	// `valueRows` can contain any sort of values, but only values that can be converted to numbers can be used to create a chart
	if (!valueRows.every((row): row is [NumberLike, ...unknown[]] => typeof row[0] === 'number' || typeof row[0] === 'string' || row[0] instanceof Date)) {
		throw new TypeError(`Charts can only be created from data that can be converted to numbers.`);
	}

	// Extract the labels
	let labels = valueRows.map((row) => row[0]);

	// If the x axis is qualitative, and its labels were limited in its options
	if (options?.x && 'labels' in options.x && options.x.labels) {
		// Remove any labels not specified in the axis options
		for (let i = 0; i < labels.length; i++) {
			const label = labels[i];
			// Use `as unknown[]` so TypeScript doesn't complain when using Array.prototype.includes
			if ((options.x.labels as unknown[]).includes(label) === false) {
				labels.splice(i, 1);
				valueRows.splice(i, 1);
				i -= i;
			}
		}

		// Go through specified labels, and if any weren't in the dataset then add empty data
		for (let i = 0; i < options.x.labels.length; i++) {
			const label = options.x.labels[i];
			if (labels.includes(label) === false) {
				const emptyData: [NumberLike, ...0[]] = [label, ...(new Array(valueRows[0].length-1)).fill(0)];
				labels.splice(i, 0, label);
				valueRows.splice(i, 0, emptyData);
			}
		}

		// Also update order of labels and value rows to match specified label order
		labels = options.x.labels;
		valueRows = valueRows.sort((rowA, rowB) => {
			const labelA = rowA[0];
			const indexA = labels.indexOf(labelA);

			const labelB = rowB[0];
			const indexB = labels.indexOf(labelB);

			return indexA - indexB;
		});
	}

	// Transpose valueRows to get groups
	const valueGroups: unknown[][] = [];
	for (let i = 0; i < valueRows.length; i++) {
		// Start at j = 1 to ignore labels
		for (let j = 1; j < valueRows[i].length; j++) {
			if (typeof valueGroups[j] === 'undefined') {
				valueGroups[j] = [];
			}
			valueGroups[j][i] = valueRows[i][j];
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
		// Using a type assertion here is safe because we're just checking for inclusion
		(groupName, index) => (numberValueGroups as unknown[]).includes(valueGroups[index])
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

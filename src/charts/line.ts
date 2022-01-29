import { AnalyserSummary } from '../AnalyserGroup.js';
import { LineChartOptions } from './ChartOptions.js';

import { ChartData, getChartData } from './ChartData.js';
import { Scale } from './Scale.js';

import { chart as renderChart, tooltip as renderTooltip } from './chart.js';

function renderLines<GroupName extends string>(chartData: ChartData<GroupName>, options?: LineChartOptions<GroupName>): string {
	const { labels, groups, groupNames } = chartData;
	const { colours } = options || {};
	const scale = new Scale(chartData, options, 'y');

	// For each label, render a bar from each group
	return `
		<div class="chart__lines-wrapper">
			<svg class="chart__lines" viewBox="0 0 100 100" preserveAspectRatio="none">
				<g transform="translate(0, 100) scale(1, -1)">
					${groups.map((group, groupIndex) => {
						const groupName = groupNames[groupIndex];
						const colour = colours && colours[groupName];

						const points = labels.map((label, labelIndex) => {
							const leftPercent = labelIndex / (labels.length-1) * 100;

							const value = group[labelIndex];
							const percentage = scale.getProportion(value) * 100;
							const str = `${leftPercent},${percentage}`;
							return str;
						}).join(' ');

						const str = `
							<polyline class="chart__line" points="${points}" style="stroke: ${colour};"></polyline>
						`;

						return str;
					}).join('')}
				</g>
			</svg>

			${groups.map((group, groupIndex) => {
				const groupName = groupNames[groupIndex];
				const colour = colours && colours[groupName];

				const str = `
					<ul class="chart__line__points">
						${labels.map((label, labelIndex) => {
							const leftPercent = labelIndex / (labels.length-1) * 100;

							const value = group[labelIndex];
							const percentage = scale.getProportion(value) * 100;

							const str = `
								<li class="chart__line__point" style="left: ${leftPercent}%; bottom: ${percentage}%" tabindex="0">
									${renderTooltip(chartData, group, label, options)}
								</li>
							`;

							return str;
						}).join('')}
					</ul>
				`;

				return str;
			}).join('')}
		</div>
	`;
}

export function line<GroupName extends string>(summary: AnalyserSummary<GroupName>, options?: LineChartOptions<GroupName>) {
	const chartData = getChartData(summary, options);
	const lines = renderLines(chartData, options);

	const chart = renderChart(chartData, lines, options);

	return chart;
};

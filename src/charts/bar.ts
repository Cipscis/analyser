import { AnalyserSummary } from '../AnalyserGroup.js';
import { ChartOptions } from './ChartOptions.js';

import { ChartData, getChartData } from './ChartData.js';
import { Scale } from './Scale.js';

import { chart as renderChart } from './chart.js';

function renderBars<GroupName extends string>(chartData: ChartData<GroupName>, options?: ChartOptions<GroupName>): string {
	const { labels, groups, groupNames } = chartData;
	const { colours } = options || {};
	const scale = new Scale(chartData);

	return `
		<!-- For each label, render a bar from each group -->
		<ul class="chart__bar-groups">
			${labels.map((label, index) => `
			<li class="chart__bar-group">
				<ul class="chart__bar-group-bars">
					${groups.map((group, groupIndex) => {
						const groupName = groupNames[groupIndex];
						const colour = colours && colours[groupName];

						const str = `<li class="chart__bar">
							<div class="chart__bar-area" style="${colour ? `background: ${colour}; ` : ''}flex-basis: ${(scale.getPercent(group[index], 2))};"></div>
						</li>`
						return str;
					}).join('')}
				</ul>
			</li>
			`).join('')}
		</ul>
	`;
}

export function bar<GroupName extends string>(summary: AnalyserSummary<GroupName>, options?: ChartOptions<GroupName>) {
	const chartData = getChartData(summary, options);
	const bars = renderBars(chartData, options);

	const chart = renderChart(chartData, bars, options);

	return chart;
};

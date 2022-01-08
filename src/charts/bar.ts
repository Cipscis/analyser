import { AnalyserSummary } from '../AnalyserGroup.js';
import { ChartOptions } from './ChartOptions.js';

import { ChartData, getChartData } from './ChartData.js';
import { Scale } from './Scale.js';

import { chart as renderChart } from './chart.js';

function renderBars<T extends string>(chartData: ChartData<T>, options?: ChartOptions): string {
	const { labels, groups, colours } = chartData;
	const scale = new Scale(chartData);

	return `
		<!-- For each label, render a bar from each group -->
		<ul class="chart__bar-groups">
			${labels.map((label, index) => `
			<li class="chart__bar-group">
				<ul class="chart__bar-group-bars">
					${groups.map((group, groupIndex) => `
						<li class="chart__bar">
							<div class="chart__bar-area" style="background: ${colours[groupIndex]}; flex-basis: ${(scale.getPercent(group[index], 2))};"></div>
						</li>
					`).join('')}
				</ul>
			</li>
			`).join('')}
		</ul>
	`;
}

export function bar<T extends string>(summary: AnalyserSummary<T>, options?: ChartOptions) {
	const chartData = getChartData(summary, options);
	const bars = renderBars(chartData, options);

	const chart = renderChart(chartData, bars, options);

	return chart;
};

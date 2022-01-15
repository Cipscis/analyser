import { AnalyserSummary } from '../AnalyserGroup.js';
import { ChartOptions } from './ChartOptions.js';

import { ChartData, getChartData } from './ChartData.js';
import { Scale } from './Scale.js';

import { chart as renderChart } from './chart.js';
import { AxisOptionsQualitative } from './AxisOptions.js';

type BarChartOptions<GroupName extends string> = ChartOptions<GroupName, AxisOptionsQualitative>;

function renderBars<GroupName extends string>(chartData: ChartData<GroupName>, options?: BarChartOptions<GroupName>): string {
	const { labels, groups, groupNames } = chartData;
	const { colours } = options || {};
	const scale = new Scale(chartData, options, 'y');

	// For each label, render a bar from each group
	return `
		<ul class="chart__bar-groups">
			${labels.map((label, index) => `
			<li class="chart__bar-group">
				<ul class="chart__bar-group-bars">
					${groups.map((group, groupIndex) => {
						const groupName = groupNames[groupIndex];
						const colour = colours && colours[groupName];

						const str = `<li class="chart__bar">
							<div class="chart__bar__area" style="${colour ? `background: ${colour}; ` : ''}flex-basis: ${(Math.max(0, scale.getProportion(group[index]))) * 100}%;" data-value="${group[index]}" tabindex="0">
								<div class="chart__bar__tooltip">
									${groupName} ${label}: ${options?.y?.format ? options.y.format.format(group[index]) : group[index]}
								</div>
							</div>
						</li>`
						return str;
					}).join('')}
				</ul>
			</li>
			`).join('')}
		</ul>
	`;
}

export function bar<GroupName extends string>(summary: AnalyserSummary<GroupName>, options?: BarChartOptions<GroupName>) {
	const chartData = getChartData(summary, options);
	const bars = renderBars(chartData, options);

	const chart = renderChart(chartData, bars, options);

	return chart;
};

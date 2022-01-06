import { ChartData } from './ChartData.js';
import { ChartOptions } from './ChartOptions.js';
import { Scale } from './Scale.js';

export function chart(chartData: ChartData, contents: string, options?: ChartOptions): string {
	return `
		<div class="chart">
			${options?.label ? title(options) : ''}

			<div class="chart__area">
				${options?.legend ? legend(chartData) : ''}

				${yGridlines(chartData, options)}

				${contents}
			</div>

			${yAxis(chartData, options)}

			${xAxis(chartData)}
		</div>
	`;
}

function title(options: ChartOptions): string {
	return `<h2 class="chart__title">${options.label}</h2>`;
}

function legend(chartData: ChartData): string {
	return `
		<div class="chart__legend">
			<span>Legend</span>

			<ul>
				${chartData.groupNames.map((groupName, index) => `
					<span style="color: ${chartData.colours[index]};">${groupName}</span>
				`).join('')}
			</ul>
		</div>
	`;
}

function yAxis(chartData: ChartData, options?: ChartOptions): string {
	const scale = new Scale(chartData, options);
	const range = scale.getRange(5);

	return `
	<!-- TODO: Render axis based on scale -->
	<ul class="chart__y-axis">
		${range.map((val) => `
		<li class="chart__y-axis-label" style="bottom: ${scale.getPercent(val)};">${val}</li>
		`).join('')}
	</ul>`;
}

function xAxis(chartData: ChartData): string {
	const { labels } = chartData;

	return `
	<!-- For each label, render that label -->
	<ul class="chart__x-axis">
		${labels.map((label) => `
		<li class="chart__x-axis-label">${label}</li>
		`).join('')}
	</ul>`;
}

function yGridlines(chartData: ChartData, options?: ChartOptions): string {
	const scale = new Scale(chartData, options);
	const range = scale.getRange(5);

	return `
		<!-- TODO: Render gridlines based on scale -->
		<ul class="chart__y-gridlines" aria-hidden="true">
			${range.map((val, index) => index > 0 ? `
			<li class="chart__y-gridline" style="bottom: ${scale.getPercent(val)};"></li>
			` : '').join('')}
		</ul>
	`;
}

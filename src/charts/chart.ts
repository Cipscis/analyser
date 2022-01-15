import { ChartData } from './ChartData.js';
import { ChartOptions } from './ChartOptions.js';
import { Scale } from './Scale.js';

export function chart<GroupName extends string>(chartData: ChartData<GroupName>, contents: string, options?: ChartOptions<GroupName>): string {
	return `
		<div class="chart">
			${options?.label ? title(options) : ''}

			<div class="chart__area">
				${options?.legend ? legend(chartData, options) : ''}

				${yGridlines(chartData, options)}

				${contents}
			</div>

			${yAxis(chartData, options)}

			${xAxis(chartData)}
		</div>
	`;
}

function title<GroupName extends string>(options: ChartOptions<GroupName>): string {
	return `<h2 class="chart__title">${options.label}</h2>`;
}

function legend<GroupName extends string>(chartData: ChartData<GroupName>, options?: ChartOptions<GroupName>): string {
	return `
		<div class="chart__legend">
			<span>Legend</span>

			<ul>
				${chartData.groupNames.map((groupName, index) => {
					const colour = options?.colours && options.colours[groupName];

					const str = `<span${colour ? ` style="color: ${colour};"` : ''}>${groupName}</span>`;
					return str;
				}).join('')}
			</ul>
		</div>
	`;
}

function yAxis<GroupName extends string>(chartData: ChartData<GroupName>, options?: ChartOptions<GroupName>): string {
	const scale = new Scale(chartData, options);
	const range = scale.getSeries(5);

	return `
	<!-- TODO: Render axis based on scale -->
	<ul class="chart__y-axis">
		${range.map((val) => `
		<li class="chart__y-axis-label" style="bottom: ${scale.getPercent(val)};">${val}</li>
		`).join('')}
	</ul>`;
}

function xAxis<GroupName extends string>(chartData: ChartData<GroupName>): string {
	const { labels } = chartData;

	return `
	<!-- For each label, render that label -->
	<ul class="chart__x-axis">
		${labels.map((label) => `
		<li class="chart__x-axis-label">${label}</li>
		`).join('')}
	</ul>`;
}

function yGridlines<GroupName extends string>(chartData: ChartData<GroupName>, options?: ChartOptions<GroupName>): string {
	const scale = new Scale(chartData, options);
	const range = scale.getSeries(5);

	return `
		<!-- TODO: Render gridlines based on scale -->
		<ul class="chart__y-gridlines" aria-hidden="true">
			${range.map((val, index) => index > 0 ? `
			<li class="chart__y-gridline" style="bottom: ${scale.getPercent(val)};"></li>
			` : '').join('')}
		</ul>
	`;
}
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

			${xAxis(chartData, options)}
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
	const axisOptions = options?.y;

	const scale = new Scale(chartData, options, 'y');
	const series = scale.getSeries(5);

	// Render axis based on scale
	return `
	<div class="chart__y-axis">
		${axisOptions?.label ? `
		<span class="chart__y-axis__label">${axisOptions.label}</span>
		` : ''}

		<ul class="chart__y-axis__value-list">
			${series.map((val) => `
			<li class="chart__y-axis__value" style="bottom: ${scale.getPercent(val)};">${val}</li>
			`).join('')}
		</ul>
	</div>`;
}

function xAxis<GroupName extends string>(chartData: ChartData<GroupName>, options?: ChartOptions<GroupName>): string {
	const axisOptions = options?.x;

	const { labels } = chartData;

	// For each label, render that label
	return `
	<div class="chart__x-axis">
		${axisOptions?.label ? `
		<span class="chart__x-axis__label">${axisOptions.label}</span>
		` : ''}
		<ul class="chart__x-axis__value-list">
			${labels.map((label) => `
			<li class="chart__x-axis__value">${label}</li>
			`).join('')}
		</ul>
	</div>`;
}

function yGridlines<GroupName extends string>(chartData: ChartData<GroupName>, options?: ChartOptions<GroupName>): string {
	const scale = new Scale(chartData, options, 'y');
	const series = scale.getSeries(5);

	// Render gridlines based on scale
	return `
		<ul class="chart__y-gridlines" aria-hidden="true">
			${series.map((val, index) => index > 0 ? `
			<li class="chart__y-gridline" style="bottom: ${scale.getPercent(val)};"></li>
			` : '').join('')}
		</ul>
	`;
}

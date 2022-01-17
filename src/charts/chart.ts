import { ChartData } from './ChartData.js';
import { ChartOptions } from './ChartOptions.js';
import { AxisOptionsQuantitative } from './AxisOptions.js';
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
			<span class="chart__legend__title">Legend</span>

			<ul class="chart__legend__items">
				${chartData.groupNames.map((groupName, index) => {
					const colour = options?.colours && options.colours[groupName];

					const str = `<li class="chart__legend__item">
						<span class="chart__legend__item__swatch"${colour ? ` style="background-color: ${colour};"` : ''}></span>
						<span class="chart__legend__item__name">${groupName}</span>
					</li>`;
					return str;
				}).join('')}
			</ul>
		</div>
	`;
}

function yAxis<GroupName extends string>(chartData: ChartData<GroupName>, options?: ChartOptions<GroupName>): string {
	const scale = new Scale(chartData, options, 'y');

	const axisOptions = options?.y;
	const values: number[] = getAxisValues(scale, axisOptions);

	// Render axis based on scale
	return `
	<div class="chart__y-axis">
		${axisOptions?.label ? `
		<span class="chart__y-axis__label">${axisOptions.label}</span>
		` : ''}

		<ul class="chart__y-axis__value-list">
			${values.map((val) => `
			<li class="chart__y-axis__value" style="bottom: ${Math.max(0, scale.getProportion(val)) * 100}%;">
				${axisOptions?.format ?
					axisOptions.format instanceof Intl.NumberFormat ?
						axisOptions.format.format(val) :
						axisOptions.format(val)
					:
					val
				}
			</li>
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

	const axisOptions = options?.y;
	const values: number[] = getAxisGridlines(scale, options?.y);

	// Render gridlines based on scale
	return `
		<ul class="chart__y-gridlines" role="presentation">
			${values.map((val, index) => {
				// Only render the first gridline if it's above the minimum number,
				// since that line is already drawn by the x axis
				const gridlines = (index > 0 || val > scale.min) ? `
					<li class="chart__y-gridline" style="bottom: ${Math.max(0, scale.getProportion(val)) * 100}%;"></li>` :
					'';

				return gridlines
			}).join('')}
		</ul>
	`;
}

function getAxisValues(scale: Scale, axisOptions?: AxisOptionsQuantitative): number[] {
	if (typeof axisOptions?.values !== 'undefined') {
		if (typeof axisOptions.values === 'number') {
			const numValues = axisOptions.values + 1;
			return scale.getSeries(numValues);
		} else {
			return axisOptions.values;
		}
	} else {
		return scale.getSeries(2);
	}
}

function getAxisGridlines(scale: Scale, axisOptions?: AxisOptionsQuantitative): number[] {
	if (typeof axisOptions?.gridlines !== 'undefined') {
		if (typeof axisOptions.gridlines === 'number') {
			const numValues = axisOptions.gridlines + 1;
			return scale.getSeries(numValues);
		} else {
			return axisOptions.gridlines;
		}
	} else {
		return getAxisValues(scale, axisOptions);
	}
}

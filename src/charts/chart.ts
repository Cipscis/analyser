import { ChartData } from './ChartData.js';
import { BaseChartOptions, ChartOptions } from './ChartOptions.js';
import { AxisOptionsQuantitative } from './AxisOptions.js';
import { Scale } from './Scale.js';

export function chart<GroupName extends string>(chartData: ChartData<GroupName>, contents: string, options?: ChartOptions<GroupName>): string {
	return `
		<figure class="chart">
			${options?.title ? title(options) : ''}

			<div class="chart__area">
				${options?.legend ? legend(chartData, options) : ''}

				${yGridlines(chartData, options)}

				${xGridlines(chartData, options)}

				${contents}
			</div>

			${yAxis(chartData, options)}

			${xAxis(chartData, options)}
		</figure>
	`;
}

function title<GroupName extends string>(options: ChartOptions<GroupName>): string {
	return `<figcaption class="chart__title">${options.title}</figcaption>`;
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
	const axisOptions = options?.y;

	const scale = new Scale(chartData, options, 'y');
	const values: number[] = getAxisValues(scale, axisOptions);

	// Render axis based on scale
	return `
	<div class="chart__y-axis">
		${axisOptions?.title ? `
		<span class="chart__y-axis__title">${axisOptions.title}</span>
		` : ''}

		<ul class="chart__y-axis__value-list">
			${values.map((val) => `
			<li class="chart__y-axis__value" style="bottom: ${Math.max(0, scale.getProportion(val)) * 100}%;">
				${applyFormat(val, axisOptions)}
			</li>
			`).join('')}
		</ul>
	</div>`;
}

function xAxis<GroupName extends string>(chartData: ChartData<GroupName>, options?: ChartOptions<GroupName>): string {
	const axisOptions = options?.x;
	if (axisOptions) {
		// AxisOptions has no required values, so we can only be certain what axis type we're dealing with if labels or values is specified
		if ('labels' in axisOptions) {
			return xAxisQualitative(chartData, options);
		} else if ('values' in axisOptions) {
			return xAxisQuantitative(chartData, options);
		}
	}

	return xAxisMinimal(chartData, options);
}

function xAxisQualitative<GroupName extends string>(chartData: ChartData<GroupName>, options?: BaseChartOptions<GroupName, AxisOptionsQuantitative>): string {
	const axisOptions = options?.x;

	const { labels } = chartData;

	// For each label, render that label
	return `
	<div class="chart__x-axis">
		${axisOptions?.title ? `<span class="chart__x-axis__title">${axisOptions.title}</span>` : ''}
		<ul class="chart__x-axis__label-list">
			${labels.map((label) => `<li class="chart__x-axis__label">${applyFormat(label, axisOptions)}</li>`).join('')}
		</ul>
	</div>`;
}

function xAxisQuantitative<GroupName extends string>(chartData: ChartData<GroupName>, options?: BaseChartOptions<GroupName, AxisOptionsQuantitative>): string {
	const axisOptions = options?.x;

	const scale = new Scale(chartData, options, 'x');
	const values: number[] = getAxisValues(scale, axisOptions);

	return `
	<div class="chart__x-axis">
		${axisOptions?.title ? `<span class="chart__x-axis__title">${axisOptions.title}</span>` : ''}
		<ul class="chart__x-axis__value-list">
			${values.map((val) => `
			<li class="chart__x-axis__value" style="left: ${Math.max(0, scale.getProportion(val)) * 100}%;">
				${applyFormat(val, axisOptions)}
			</li>
			`).join('')}
		</ul>
	</div>`;
}

function xAxisMinimal<GroupName extends string>(chartData: ChartData<GroupName>, options?: ChartOptions<GroupName>): string {
	const axisOptions = options?.x;

	return `
	<div class="chart__x-axis">
		${axisOptions?.title ? `<span class="chart__x-axis__title">${axisOptions.title}</span>` : ''}
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

function xGridlines<GroupName extends string>(chartData: ChartData<GroupName>, options?: ChartOptions<GroupName>): string {
	const axisOptions = options?.x;

	if (axisOptions && ('values' in axisOptions || 'gridlines' in axisOptions)) {
		const scale = new Scale(chartData, options, 'x');
		const values: number[] = getAxisGridlines(scale, axisOptions);

		// Render gridlines based on scale
		return `
			<ul class="chart__x-gridlines" role="presentation">
				${values.map((val, index) => {
					// Only render the first gridline if it's above the minimum number,
					// since that line is already drawn by the y axis
					const gridlines = (index > 0 || val > scale.min) ? `
						<li class="chart__x-gridline" style="left: ${Math.max(0, scale.getProportion(val)) * 100}%;"></li>` :
						'';

					return gridlines
				}).join('')}
			</ul>
		`;
	} else {
		return '';
	}
}

export function tooltip<GroupName extends string>(chartData: ChartData<GroupName>, group: number[], label: string, options?: ChartOptions<GroupName>): string {
	const { labels, groups, groupNames } = chartData;
	const groupIndex = groups.indexOf(group);
	if (groupIndex === -1) {
		throw new Error(`Cannot render tooltip: unrecognised group`);
	}

	const groupName = groupNames[groupIndex];

	const labelIndex = labels.indexOf(label);
	if (labelIndex === -1) {
		throw new Error(`Cannot render tooltip: unrecognised label`);
	}

	const value = group[labelIndex];

	const str = `
	<div class="chart__tooltip">
		${groups.length > 1 ? groupName : ''} ${label}: ${applyFormat(value, options?.y)}
	</div>`;

	return str;
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

function applyFormat(value: any, axisOptions?: AxisOptionsQuantitative): string {
	if (typeof value === 'number') {
		if (axisOptions?.numberFormat) {
			if (axisOptions.numberFormat instanceof Intl.NumberFormat) {
				return axisOptions.numberFormat.format(value);
			} else {
				return axisOptions.numberFormat(value);
			}
		} else {
			return value.toString();
		}
	} else if (value instanceof Date) {
		if (axisOptions?.dateFormat) {
			if (axisOptions.dateFormat instanceof Intl.DateTimeFormat) {
				return axisOptions.dateFormat.format(value);
			} else {
				return axisOptions.dateFormat(value);
			}
		} else {
			return value.toString();
		}
	} else {
		return '' + value;
	}
}

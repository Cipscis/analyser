import * as statistics from '../statistics.js';
import { ChartData } from './ChartData.js';
import { ChartOptions } from './ChartOptions.js';
import { AxisOptionsQuantitative } from './AxisOptions.js';

export interface ScaleOptions {
	min: number,
	max: number,
}

export class Scale {
	min: number;
	max: number;

	get width(): number {
		return this.max - this.min;
	};

	constructor(options: ScaleOptions | ChartData, chartOptions?: ChartOptions, type?: 'y' | 'x') {
		[this.min, this.max] = getMinMax(options, chartOptions, type);
	}

	/**
	 * Standardises the scale to go from 0 to 1,
	 * then finds the value's position within it.
	 */
	getProportion(value: number): number {
		const proportion = (value - this.min) / this.width;

		return proportion;
	}

	/**
	 * Given a proportion value on a scale from 0 to 1,
	 * find the equivalent value on this scale.
	 */
	getValue(proportion: number): number {
		const value = this.width * proportion + this.min;

		return value;
	}

	/**
	 * For a given length of at least 2, create an array
	 * of numbers from the bottom of the scale to the top,
	 * with an equal step between each number in the range.
	 */
	getSeries(length: number): number[] {
		if (length < 2) {
			length = 2;
		}

		const stepSize = this.width / (length-1);

		// Start with minimum value
		const series: number[] = [this.min];

		// Add intermediate steps
		for (let i = 0; i < length-2; i++) {
			series.push(series[series.length-1] + stepSize);
		}

		// End with max value
		series.push(this.max);

		return series;
	}
}

/**
 * Determines the appropriate method for reading or calculating min and max values,
 * based on the available data and options, then reads or calculates them.
 */
function getMinMax(options: ScaleOptions | ChartData, chartOptions?: ChartOptions, type?: 'y' | 'x'): [number, number] {
	let min: number;
	let max: number;

	// First, get minMax from options
	if ('groups' in options) {
		// options is of type ChartData, so determine min and max based on the data
		[min, max] = getMinMaxFromChartData(options);
	} else {
		// options is a ScaleOptions, so read min and max directly
		[min, max] = getMinMaxFromScaleOptions(options);
	}

	// If min is larger than max, swap them around
	if (min > max) {
		[min, max] = [max, min];
	}

	// Then, see if min and/or max are overridden by chartOptions
	if (type && chartOptions) {
		const axisOptions = chartOptions[type];
		if (axisOptions && ('min' in axisOptions || 'max' in axisOptions || 'values' in axisOptions)) {
			[min, max] = getMinMaxFromChartOptions(axisOptions, min, max);
		}
	}

	return [min, max];
}

/**
 * Calculates min and max values based on the values contained in a set of ChartData.
 */
function getMinMaxFromChartData(options: ChartData): [number, number] {
	let min: number;
	let max: number;

	const { groups } = options;

	// Use `as number[]` here so TypeScript doesn't complain when using Array.prototype.concat
	const allValues: number[] = ([] as number[]).concat(...groups);

	if (typeof options.min === 'undefined') {
		min = Math.min(...allValues);
	} else {
		min = options.min;
	}

	if (typeof options.max === 'undefined') {
		max = Math.max(...allValues);
	} else {
		max = options.max;
	}

	return [min, max];
}

/**
 * Reads min and max values directly from a ScaleOptions object.
 */
function getMinMaxFromScaleOptions(options: ScaleOptions): [number, number] {
	const { min, max } = options;

	return [min, max];
}

/**
 * Determines min and max values from an AxisOptions object, either reading them
 * directly from the options or calculating them from the highest order of magnitude
 * and, if specified, the number of values that needs to display on an axis.
 */
function getMinMaxFromChartOptions(axisOptions: AxisOptionsQuantitative, min: number, max: number): [number, number] {
	if (axisOptions) {
		if ('min' in axisOptions) {
			if (typeof axisOptions.min === 'number') {
				min = axisOptions.min;
			} else if (axisOptions.min === 'auto') {
				// Determine highest power of 10 within min and max
				const maxPower = Math.floor(
					Math.log10(
						Math.max(
							Math.abs(max),
							Math.abs(min),
						)
					)
				);

				// Round down min to nearest multiple of that power of 10
				const widthRoundTo = Math.pow(10, maxPower);
				min = Math.floor(min / widthRoundTo) * widthRoundTo;

				// If the power was negative, fix any floating point issues that may have arisen
				if (maxPower < 0) {
					min = +(min.toFixed(-maxPower));
				}
			}
		}

		if ('max' in axisOptions) {
			if (typeof axisOptions.max === 'number') {
				max = axisOptions.max;
			} else if (axisOptions.max === 'auto') {
				// Determine highest power of 10 within min and max
				const maxPower = Math.floor(
					Math.log10(
						Math.max(
							Math.abs(max),
							Math.abs(min),
						)
					)
				);

				// Subtract min so we're working directly with the width
				max -= min;

				// Round up max to nearest multiple of that power of 10
				let widthRoundTo = Math.pow(10, maxPower);
				max = Math.ceil(max / widthRoundTo) * widthRoundTo;

				// If the number of values to be displayed has been set
				if (typeof axisOptions.values === 'number') {
					// Only integers are accepted
					if (Number.isInteger(axisOptions.values) === false) {
						throw new TypeError(`axisOptions.values must be an integer.`);
					}

					// Continue to increase max until it is a multiple of the next
					// greatest power of 10 below the largest one beneath max.
					// Also, ensure max is greater than min
					const valuePower = maxPower - 1;
					let valueRoundTo = Math.pow(10, valuePower) * axisOptions.values;

					// If that power is negative, JavaScript can run into issues
					// to do with numbers like 0.1 being unable to be represented in binary.
					// So multiply everything by that power and round it, then divide and fix at the end
					if (valuePower < 0) {
						valueRoundTo = Math.round(valueRoundTo / Math.pow(10, valuePower));
						widthRoundTo = Math.round(widthRoundTo / Math.pow(10, valuePower));
						max = Math.round(max / Math.pow(10, valuePower));
					}

					for (let iterations = 0; iterations < 1000; iterations++) {
						let remainder = max % valueRoundTo;

						if (remainder === 0 && max > 0) {
							break;
						} else {
							max += widthRoundTo;
						}
					}

					// If we muliplied everything earlier, undo that now then fix any floating point issues
					if (valuePower < 0) {
						max = +(max * Math.pow(10, valuePower)).toFixed(-valuePower);
					}
				}

				// Add min back to convert width back to max
				max += min;
			}
		}
	}

	return [min, max];
}

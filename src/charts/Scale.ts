import * as statistics from '../statistics.js';
import { ChartData } from './ChartData.js';
import { ChartOptions } from './ChartOptions.js';

export interface ScaleOptions {
	min: number,
	max: number,
}

export class Scale {
	min: number;
	max: number;

	get range(): number {
		return this.max - this.min;
	};

	constructor(options: ScaleOptions | ChartData, chartOptions?: ChartOptions, type?: 'y' | 'x') {
		[this.min, this.max] = getMinMax(options);

		// min and max may be overridden by chartOptions
		if (type && chartOptions) {
			const axisOptions = chartOptions[type];
			if (axisOptions) {
				if ('min' in axisOptions && typeof axisOptions.min === 'number') {
					this.min = axisOptions.min;
				}

				if ('max' in axisOptions) {
					if (typeof axisOptions.max === 'number') {
						this.max = axisOptions.max;
					} else if (axisOptions.max === 'auto') {
						// Round max up to nearest multiple of
						// the greatest power of 10 beneath it, and
						// ensure the number of values to be displayed will
						// fit easily within the range of the scale

						// First, determine highest power of 10
						const power = Math.floor(Math.log10(this.max));
						const roundTo = Math.pow(10, power);

						// Then, round up max to nearest multiple of that power of 10
						this.max = Math.ceil(this.max / roundTo) * roundTo;

						// Then, if the number of values to be displayed has been set,
						// continue to increase max until it is a multiple of it too
						if (axisOptions.values) {
							while ((this.range % axisOptions.values) || this.max <= this.min) {
								this.max += roundTo;
							}
						}
					}
				}
			}
		}
	}

	/**
	 * Standardises the scale to go from 0 to 1,
	 * then finds the value's position within it.
	 */
	getProportion(value: number): number {
		const percent = (value - this.min) / this.range;

		return percent;
	}

	/**
	 * Given a proportion value on a scale from 0 to 1,
	 * find the equivalent value on this scale.
	 */
	getValue(proportion: number): number {
		const value = this.range * proportion + this.min;

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

		const stepSize = this.range / (length-1);

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

function getMinMax(options: ScaleOptions | ChartData): [number, number] {
	let min: number;
	let max: number;

	if ('groups' in options) {
		// options is of type ChartData, so determine min and max based on the data
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
	} else {
		// options is a ScaleOptions, so read min and max directly
		min = options.min;
		max = options.max;
	}

	// If min is larger than max, swap them around
	if (min > max) {
		[min, max] = [max, min];
	}

	return [min, max];
}

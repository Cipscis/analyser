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

	constructor(options: ScaleOptions | ChartData<string>, chartOptions?: ChartOptions<string>) {
		if ('groups' in options) {
			// options: ChartData
			const { groups } = options;
		
			// Use `as number[]` here so TypeScript doesn't complain when using Array.prototype.concat
			const allValues: number[] = ([] as number[]).concat(...groups);

			if (typeof options.min === 'undefined') {
				this.min = statistics.min(allValues);
			} else {
				this.min = options.min;
			}
			
			if (typeof options.max === 'undefined') {
				this.max = statistics.max(allValues);
			} else {
				this.max = options.max;
			}
		} else {
			// options: ScaleOptions
			this.min = options.min;	
			this.max = options.max;
		}

		// TODO: This is going to cause trouble when you want to do scatterplots with two numeric axes
		if (typeof chartOptions?.yMin !== 'undefined') {
			this.min = chartOptions.yMin;
		}
		if (typeof chartOptions?.yMax !== 'undefined') {
			this.max = chartOptions.yMax;
		}

		// If min is larger than max, swap them around
		if (this.min > this.max) {
			[this.min, this.max] = [this.max, this.min];
		}
	}

	/**
	 * Standardises the scale to go from 0 to 1,
	 * then finds the value's position within it.
	 */
	getProportion(value: number): number {
		const percent = (value - this.min) / (this.max - this.min)

		return percent;
	}

	/**
	 * Returns a percentage string representing the value's position on the scale,
	 * optionally with a fixed number of digits after the decimal point.
	 */
	getPercent(value: number, fractionDigits?: number): string {
		const proportion = this.getProportion(value) * 100;
		const proportionString = typeof fractionDigits === 'undefined' ? `${proportion}` : proportion.toFixed(fractionDigits);

		return `${proportionString}%`;
	}

	/**
	 * Given a proportion value on a scale from 0 to 1,
	 * find the equivalent value on this scale.
	 */
	getValue(proportion: number): number {
		const value = (this.max - this.min) * proportion + this.min;

		return value;
	}

	/**
	 * For a given length of at least 2, create an array
	 * of numbers from the bottom of the scale to the top,
	 * with an equal step between each number in the range.
	 */
	getRange(length: number): number[] {
		if (length < 2) {
			length = 2;
		}

		const stepSize = (this.max - this.min) / (length-1);

		// Start with minimum value
		const range: number[] = [this.min];

		// Add intermediate steps
		for (let i = 0; i < length-2; i++) {
			range.push(range[range.length-1] + stepSize);
		}

		// End with max value
		range.push(this.max);

		return range;
	}
}

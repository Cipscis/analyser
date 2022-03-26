import { ChartData } from './ChartData.js';
import { ChartOptions } from './ChartOptions.js';
export interface ScaleOptions {
    min: number;
    max: number;
}
export declare class Scale {
    min: number;
    max: number;
    get width(): number;
    constructor(options: ScaleOptions | ChartData, chartOptions?: ChartOptions, type?: 'y' | 'x');
    /**
     * Standardises the scale to go from 0 to 1,
     * then finds the value's position within it.
     */
    getProportion(value: number): number;
    /**
     * Given a proportion value on a scale from 0 to 1,
     * find the equivalent value on this scale.
     */
    getValue(proportion: number): number;
    /**
     * For a given length of at least 2, create an array
     * of numbers from the bottom of the scale to the top,
     * with an equal step between each number in the range.
     */
    getSeries(length: number): number[];
}

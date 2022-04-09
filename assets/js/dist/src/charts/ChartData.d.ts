import { AnalyserSummary } from '../AnalyserGroup.js';
import { ChartOptions } from './ChartOptions.js';
/**
 * Types that can be coerced to `number`
 */
declare type NumberLike = number | string | Date;
export declare type ChartData<GroupName extends string = string> = {
    labels: NumberLike[];
    groupNames: GroupName[];
    groups: number[][];
    min?: number;
    max?: number;
    stacked?: boolean;
};
export declare function getChartData<GroupName extends string>(summary: AnalyserSummary<GroupName>, options?: ChartOptions<GroupName>): ChartData<GroupName>;
export {};

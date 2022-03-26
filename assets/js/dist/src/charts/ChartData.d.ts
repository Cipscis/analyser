import { AnalyserSummary } from '../AnalyserGroup.js';
import { ChartOptions } from './ChartOptions.js';
export declare type ChartData<GroupName extends string = string> = {
    labels: any[];
    groupNames: GroupName[];
    groups: number[][];
    min?: number;
    max?: number;
    stacked?: boolean;
};
export declare function getChartData<GroupName extends string>(summary: AnalyserSummary<GroupName>, options?: ChartOptions<GroupName>): ChartData<GroupName>;

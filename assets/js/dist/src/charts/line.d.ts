import { AnalyserSummary } from '../AnalyserGroup.js';
import { LineChartOptions } from './ChartOptions.js';
export declare function line<GroupName extends string>(summary: AnalyserSummary<GroupName>, options?: LineChartOptions<GroupName>): string;

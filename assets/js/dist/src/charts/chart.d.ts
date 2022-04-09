import { ChartData } from './ChartData.js';
import { ChartOptions } from './ChartOptions.js';
export declare function chart<GroupName extends string>(chartData: ChartData<GroupName>, contents: string, options?: ChartOptions<GroupName>): string;
export declare function tooltip<GroupName extends string>(chartData: ChartData<GroupName>, group: number[], label: unknown, options?: ChartOptions<GroupName>): string;

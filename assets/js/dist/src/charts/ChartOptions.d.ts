import { AxisOptions, AxisOptionsQualitative, AxisOptionsQuantitative } from './AxisOptions.js';
export interface BaseChartOptions<GroupName extends string = string, XAxisType extends AxisOptions = AxisOptions> {
    title?: string;
    legend?: boolean;
    colours?: Partial<Record<GroupName, string>>;
    x?: XAxisType;
    y?: AxisOptionsQuantitative;
}
export declare type BarChartOptions<GroupName extends string> = BaseChartOptions<GroupName, AxisOptionsQualitative> & {
    stacked?: boolean;
};
export declare type LineChartOptions<GroupName extends string> = BaseChartOptions<GroupName, AxisOptionsQuantitative>;
export declare type ChartOptions<GroupName extends string = string> = BarChartOptions<GroupName> | LineChartOptions<GroupName>;

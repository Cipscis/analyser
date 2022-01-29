import { AxisOptions, AxisOptionsQualitative, AxisOptionsQuantitative } from './AxisOptions.js';

export interface BaseChartOptions<GroupName extends string = string, XAxisType extends AxisOptions = AxisOptions> {
	title?: string,
	legend?: boolean,

	colours?: Partial<Record<GroupName, string>>,

	x?: XAxisType,
	y?: AxisOptionsQuantitative,
}

export type BarChartOptions<GroupName extends string> = BaseChartOptions<GroupName, AxisOptionsQualitative> & {
	stacked?: boolean;
};

export type LineChartOptions<GroupName extends string> = BaseChartOptions<GroupName, AxisOptionsQuantitative>;

export type ChartOptions<GroupName extends string = string> = BarChartOptions<GroupName> | LineChartOptions<GroupName>;

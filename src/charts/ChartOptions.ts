import { AxisOptions, AxisOptionsQualitative, AxisOptionsQuantitative } from './AxisOptions.js';

interface BaseChartOptions<GroupName extends string = string, XAxisType extends AxisOptions = AxisOptions> {
	title?: string,
	legend?: boolean,

	colours?: Partial<Record<GroupName, string>>,

	// TODO: Allow x axis options to be AxisOptionsQuantitative for some graph types
	x?: XAxisType,
	y?: AxisOptionsQuantitative,
}

export type BarChartOptions<GroupName extends string> = BaseChartOptions<GroupName, AxisOptionsQualitative> & {
	stacked?: boolean;
};

// TODO: Allow quantitative axes
export type LineChartOptions<GroupName extends string> = BaseChartOptions<GroupName, AxisOptionsQualitative>;

export type ChartOptions<GroupName extends string = string> = BarChartOptions<GroupName> | LineChartOptions<GroupName>;

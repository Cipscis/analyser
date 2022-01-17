import { AxisOptions, AxisOptionsQualitative, AxisOptionsQuantitative } from './AxisOptions.js';

interface BaseChartOptions<GroupName extends string = string, XAxisType extends AxisOptions = AxisOptions> {
	label?: string,
	legend?: boolean,

	colours?: Partial<Record<GroupName, string>>,

	// TODO: Allow x axis options to be AxisOptionsQuantitative for some graph types
	x?: XAxisType,
	y?: AxisOptionsQuantitative,
}

export type BarChartOptions<GroupName extends string> = BaseChartOptions<GroupName, AxisOptionsQualitative> & {
	stacked?: boolean;
};

export type ChartOptions<GroupName extends string = string> = BarChartOptions<GroupName>;

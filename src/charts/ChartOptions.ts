import { AxisOptions, AxisOptionsQualitative, AxisOptionsQuantitative } from './AxisOptions.js';

export interface ChartOptions<GroupName extends string = string, XAxisType extends AxisOptions = AxisOptions> {
	label?: string,
	legend?: boolean,

	colours?: Partial<Record<GroupName, string>>,

	// TODO: Allow x axis options to be AxisOptionsQuantitative for some graph types
	x?: XAxisType,
	y?: AxisOptionsQuantitative,
}

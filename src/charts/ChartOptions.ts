import { AxisOptions } from './AxisOptions.js';

export interface ChartOptions<GroupName extends string = string> {
	label?: string,
	legend?: boolean,

	colours?: Partial<Record<GroupName, string>>,

	x?: AxisOptions,
	y?: AxisOptions,
}

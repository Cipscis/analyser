export interface ChartOptions<GroupName extends string> {
	label?: string,
	legend?: boolean,

	colours?: Partial<Record<GroupName, string>>,

	yMin?: number,
	yMax?: number,
}

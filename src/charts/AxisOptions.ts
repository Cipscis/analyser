interface AxisOptionsBase {
	title?: string,
}

export interface AxisOptionsQualitative extends AxisOptionsBase {
	labels?: string[],
}

export interface AxisOptionsQuantitative extends AxisOptionsBase {
	values?: number | number[],
	gridlines?: number | number[],

	format?: Intl.NumberFormat | ((value: number) => string),

	max?: number | 'auto',
	min?: number | 'auto',
};

export type AxisOptions = AxisOptionsQualitative | AxisOptionsQuantitative;

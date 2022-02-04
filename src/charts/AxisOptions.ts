interface AxisOptionsBase {
	title?: string,
}

export interface AxisOptionsQualitative extends AxisOptionsBase {
	labels?: any[],
}

export interface AxisOptionsQuantitative extends AxisOptionsBase {
	values?: number | number[],
	gridlines?: number | number[],

	numberFormat?: Intl.NumberFormat | ((value: number) => string),
	dateFormat?: Intl.DateTimeFormat | ((value: Date) => string),

	max?: number | 'auto',
	min?: number | 'auto',
};

export type AxisOptions = AxisOptionsQualitative | AxisOptionsQuantitative;

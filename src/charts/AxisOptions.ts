interface AxisOptionsBase {
	title?: string,

	numberFormat?: Intl.NumberFormat | ((value: number) => string),
	dateFormat?: Intl.DateTimeFormat | ((value: Date) => string),
}

export interface AxisOptionsQualitative extends AxisOptionsBase {
	labels?: any[],
}

export interface AxisOptionsQuantitative extends AxisOptionsBase {
	values?: number | number[],
	gridlines?: number | number[],

	max?: number | 'auto',
	min?: number | 'auto',
};

export type AxisOptions = AxisOptionsQualitative | AxisOptionsQuantitative;

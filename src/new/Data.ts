export interface Data<RowShape extends Record<string, unknown>> {
	filter(...args: Parameters<Array<RowShape>['filter']>): this;
}

export class Data<RowShape extends Record<string, unknown>> extends Array<RowShape> {
	constructor(source?: number | Array<RowShape>) {
		if (Array.isArray(source)) {
			super(source.length);
			for (let i = 0; i < source.length; i++) {
				this[i] = source[i];
			}
		} else if (typeof source === 'number') {
			super(source);
		} else {
			super();
		}
	}
}

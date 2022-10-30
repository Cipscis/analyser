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

	/**
	 * Creates a new `Data` object with an additional column
	 */
	addCol<ColName extends string, T>(colName: ColName, creator: (row: RowShape, index: number, data: RowShape[]) => T): Data<RowShape & Record<ColName, T>>
	addCol<ColName extends string, T>(colName: ColName, newRow: T[]): Data<RowShape & Record<ColName, T>>
	addCol<ColName extends string, T>(colName: ColName, creator: ((row: RowShape, index: number, data: RowShape[]) => T) | T[]) {
		if (Array.isArray(creator)) {
			if (this.length !== creator.length) {
				throw new Error(`New column of length ${creator.length} cannot be added. It must be of length ${this.length}.`);
			}

			const newRows = this.map((row, i, data) => {
				return Object.assign(
					{},
					row,
					{ [colName]: creator[i] },
				);
			});

			return new Data(newRows);
		} else {
			const newRows = this.map((row, i, data) => {
				return Object.assign(
					{},
					row,
					{ [colName]: creator(row, i, data) },
				);
			});

			return new Data(newRows);
		}
	}
}

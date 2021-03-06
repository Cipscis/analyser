interface AnalyserRows {
	filter(...args: Parameters<typeof Array.prototype.filter>): this;
}

class AnalyserRows extends Array<unknown[]> {
	constructor(source?: unknown[][] | number) {
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
	 * Returns the specified column.
	 */
	getCol(colNum: number): unknown[] {
		if (typeof colNum !== 'number') {
			throw new TypeError(`colNum must be a number.`);
		} else if (colNum < 0 || colNum >= this[0]?.length) {
			throw new RangeError(`colNum out of range.`);
		}

		const col: unknown[] = [];
		for (const row of this) {
			col.push(row[colNum]);
		}

		return col;
	}

	/**
	 * Adds a new column to AnalyserRows, and returns its index.
	 */
	addCol<T>(creator: (row: unknown[], index: number) => T): number
	addCol<T>(newRow: T[]): number
	addCol<T>(creator: ((row: unknown[], index: number) => T) | T[]): number {
		const colIndex = this[0].length;

		if (Array.isArray(creator)) {
			if (this.length !== creator.length) {
				throw new Error(`New column of length ${creator.length} cannot be added. It must be of length ${this.length}.`);
			}

			for (const [i, row] of this.entries()) {
				row.push(creator[i]);
			}
		} else {
			for (const [i, row] of this.entries()) {
				row.push(creator(row, i));
			}
		}

		return colIndex;
	}
}

export { AnalyserRows };

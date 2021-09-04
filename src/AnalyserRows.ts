class AnalyserRows extends Array {
	constructor(source?: any[] | number) {
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
	 *
	 * @param  {number} colNum - The index of the column to return.
	 *
	 * @return {any[]} - The specified column.
	 */
	getCol(colNum: number): any[] {
		if (typeof colNum !== 'number') {
			throw new TypeError(`colNum must be a number.`);
		} else if (colNum < 0 || colNum >= this[0].length) {
			throw new RangeError(`colNum out of range.`);
		}

		const col = [];
		for (let row of this) {
			col.push(row[colNum]);
		}

		return col;
	}

	/**
	 * Adds a new column to AnalyserRows, and returns its index.
	 *
	 * @param  {any[] | ((row: any[], index: number) => any))} creator - Either the column to add, or a function to create the new column's values.
	 *
	 * @return {number} - The index of the newly added column.
	 */
	addCol(creator: any[] | ((row: any[], index: number) => any)): number {
		const colIndex = this[0].length;

		if (Array.isArray(creator)) {
			if (this.length !== creator.length) {
				throw new Error(`New column of length ${creator.length} cannot be added. It must be of length ${this.length}.`);
			}

			for (let [i, row] of this.entries()) {
				row.push(creator[i]);
			}
		} else {
			for (let [i, row] of this.entries()) {
				row.push(creator(row, i));
			}
		}

		return colIndex;
	}
}

export { AnalyserRows };

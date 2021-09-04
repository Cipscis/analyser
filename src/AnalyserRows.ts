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
}

export { AnalyserRows };

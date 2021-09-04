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
}

export { AnalyserRows };

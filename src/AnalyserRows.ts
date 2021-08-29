class AnalyserRows extends Array {
	constructor(sourceArray: any[]) {
		super(sourceArray.length);
		for (let i = 0; i < sourceArray.length; i++) {
			this[i] = sourceArray[i];
		}
	}
}

export { AnalyserRows };

import { AnalyserRows } from './AnalyserRows.js';
import { FilterResolverExtender } from './filtering.js';
import { Grouper } from './grouping.js';

interface DataConfig<T extends string> {
	rows: AnalyserRows,
	raw: string[][],

	cols: Record<T, number>,
	addedCols: Record<string, number>,

	by: FilterResolverExtender,
	group: Grouper,

	aliases?: string[][],
}

export { DataConfig };

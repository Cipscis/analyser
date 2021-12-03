import { AnalyserRows } from './AnalyserRows.js';
import { FilterResolverExtender } from './filtering.js';
import { Grouper } from './grouping.js';

interface DataConfig {
	rows: AnalyserRows,
	cols: Record<string, number>,
	by: FilterResolverExtender,
	group: Grouper,

	aliases?: string[][],
}

export { DataConfig };

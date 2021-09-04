import { AnalyserRows } from './AnalyserRows.js';
import { Cols } from './Cols.js';
import { Aliases } from './Aliases.js';
import { FilterResolverExtender } from './filtering.js';
import { Grouper } from './grouping.js';

interface DataConfig {
	rows: AnalyserRows,
	cols: Cols,
	by: FilterResolverExtender,
	group: Grouper,

	aliases?: Aliases,
}

export { DataConfig };

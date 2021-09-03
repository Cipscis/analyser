import { AnalyserRows } from './AnalyserRows.js';
import { Cols } from './Cols.js';
import { Aliases } from './Aliases.js';
import { FilterResolverExtender } from './filtering.js';

interface DataConfig {
	rows: AnalyserRows,
	cols: Cols,
	by: FilterResolverExtender,

	aliases?: Aliases,
}

export { DataConfig };

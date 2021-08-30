import { AnalyserRows } from './AnalyserRows';
import { Cols } from './Cols';
import { Aliases } from './Aliases';
import { FilterResolverExtender } from './filtering';

interface DataConfig {
	rows: AnalyserRows,
	cols: Cols,
	by: FilterResolverExtender,

	aliases?: Aliases,
}

export { DataConfig };

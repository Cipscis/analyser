import { AnalyserRows } from './AnalyserRows';
import { Cols } from './Cols';
import { Aliases } from './Aliases';
import { FilterFunction } from './filtering';

interface DataConfig {
	rows: AnalyserRows,
	cols: Cols,
	by: FilterFunction,

	aliases?: Aliases,
}

export { DataConfig };

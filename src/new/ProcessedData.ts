import { FilterResolverExtender } from './filtering.js';
import { Data } from './Data.js';

export type ProcessedData<
	ColName extends string,
	RowShape extends Record<ColName, unknown>
> = {
	rows: Data<RowShape>;

	by: FilterResolverExtender<ColName, RowShape>;

	aliases?: string[][];
};

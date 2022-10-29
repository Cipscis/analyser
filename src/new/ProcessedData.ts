import { Data } from './Data.js';

export type ProcessedData<
	ColName extends string,
	RowShape extends Record<ColName, unknown>
> = {
	rows: Data<RowShape>;

	aliases?: string[][];
	matchAlias: (valueA: unknown, valueB: unknown) => boolean;
};

import { Data } from './Data.js';

export type ProcessedData<
	ColName extends string,
	RowShape extends Record<ColName, unknown>
> = {
	rows: Data<RowShape>;

	aliases?: string[][];

	/**
	 * Check if two values are equal.
	 *
	 * If both values are strings, and the data was processed with aliases, strings within the same alias group will be treated as equal.
	 */
	matchAlias: (valueA: unknown, valueB: unknown) => boolean;
};

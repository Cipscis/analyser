import { FileConfig } from './FileConfig.js';
import { Data } from './Data.js';
interface LoadFileOptions {
    /** Set to false to allow continuing after type failure */
    strict?: boolean;
}
/**
 * Load a single CSV file and process its contents.
 */
export declare function loadFile<RowShape extends Record<string, unknown>>(fileConfig: FileConfig<keyof RowShape & string, RowShape>, options?: LoadFileOptions): Promise<Data<RowShape>>;
/**
 * Converts a map of column names to column identifiers using `getColNumber` so all column identifiers are integers.
 *
 * Any columns with invalid identifiers will be removed from the result.
 *
 * @param colsConfig - A map of column names to their indices
 */
export declare function getColNumbers<ColName extends string>(colsConfig: Record<ColName, readonly [string | number, ...unknown[]]>): Record<ColName, number>;
/**
 * Convert a column heading from spreadsheet software to its integer representation. For example, converts 'A' to 0, or 'ZE' to 680.
 *
 * If a non-negative integer is passed, it will be returned untransformed. Any other value, including an invalid string, will return null.
 */
export declare function getColNumber(index: number | string): number | null;
/**
 * Checks if one or more `matchValues` matches one or more `testValues`, optionally taking a set of aliases where groups of strings are treated as equal.
 */
export declare function matchWithAlias(testValue: unknown, matchValue: unknown, aliases?: readonly string[][]): boolean;
export {};

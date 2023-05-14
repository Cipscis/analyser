import { FileConfig } from './FileConfig.js';
import { Data } from './Data.js';
/**
 * Used to configure the behaviour of {@linkcode loadFile}
 */
interface LoadFileOptions {
    /**
     * This property controls how {@linkcode loadFile} deals with errors
     * being thrown by {@linkcode TypeFn type functions}.
     *
     * By default, these errors will not be caught, so they will output an
     * error to the console detailing where the value that caused the error
     * exists in your ddata.
     *
     * However, if {@linkcode LoadFileOptions.strict} is set to `false`, then
     * instead these errors will result in a warning being output to the console,
     * and the value that caused the error will be converted to `null`.
     *
     * This non-strict mode should only be used when initially determining how
     * a data set should be processed, as the conversion of data to `null` is not
     * type-safe.
     */
    strict?: boolean;
}
/**
 * Loads a single CSV file configured with a {@linkcode FileConfig} object.
 *
 * If the file is loaded and processed successfully, the `Promise` returned
 * will resolve to a {@linkcode Data} object.
 *
 * @see {@linkcode LoadFileOptions}
 */
export declare function loadFile<RowShape extends Record<string, unknown>>(fileConfig: FileConfig<keyof RowShape & string, RowShape>, options?: LoadFileOptions): Promise<Data<RowShape>>;
/**
 * Converts a map of column names like the one that can be provided as part of a {@linkcode FileConfig} object,
 * transforming each property according to the same rules as {@linkcode getColNumber}.
 *
 * If any of those transformations results in `null`, the property will be removed from the result.
 *
 * @param colsConfig - A map of column names to their indices
 */
export declare function getColNumbers<ColName extends string>(colsConfig: Record<ColName, readonly [string | number, ...unknown[]]>): Record<ColName, number>;
/**
 * Convert a string of the format used as column headings by spreadsheet software like
 * Microsoft Excel into 0-indexed numbers.
 *
 * For example `'A'` would be converted to `0`, whereas `'ZE'` would be converted to `680`.
 * This is case insensitive.
 *
 * If a positive integer is passed, it will be returned unchanged.
 *
 * Any other number, or any string containing an invalid character, will instead be converted to `null`.
 */
export declare function getColNumber(index: number | string): number | null;
/**
 * This function allows {@linkcode Array.prototype.filter} to be used on a {@linkcode Data} object
 * while respecting a data set's aliases.
 *
 * It takes two arguments, which can each be either a single value or an array of values.
 * If any value in both of these arguments is either a direct match or are aliases of one another,
 * then the result will be `true`. Otherwise, the result will be `false`.
 *
 * Filtering can also be done without this function, when working with data that has no aliases, or
 * filtering by columns that don't contain string values.
 */
export declare function matchWithAlias(testValue: unknown, matchValue: unknown, aliases?: readonly string[][]): boolean;
export {};

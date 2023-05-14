import { TypeFn } from './types/TypeFn.js';
declare type ColConfig<RowShape extends Record<string, unknown>> = {
    [Col in keyof RowShape]: [string | number, TypeFn<RowShape[Col]>];
};
/**
 * This type describes how to process a file, including where it is and how it is structured.
 *
 * It is possible to create an object of this type directly, but because of how TypeScript's generic
 * type inference is limited to functions it is recommended to use the {@linkcode fileConfig} method
 * when working with TypeScript in order to improve both type checking when creating the object and
 * autocompletion prompts for column names after the file has been processed.
 */
export declare type FileConfig<ColName extends string, RowShape extends Record<ColName, unknown>> = {
    /** This string is used to {@linkcode fetch} the CSV file to be processed. */
    path: string;
    /**
     * Specifies the names and locations of each column to be processed, as
     * well as what type it should have. Not every column present in the file needs to be
     * specified, but you should specify each column that you wish to access.
     *
     * If the column's location is specified as a string, it will be passed through {@linkcode getColNumber}
     * to convert it into a number.
     */
    cols: ColConfig<RowShape>;
    /** The number of empty rows at the start of the CSV file which should be ignored, such as label rows. */
    headerRows?: number;
    /** The number of rows at the end of the CSV file which should be ignored, such as total rows. */
    footerRows?: number;
    /**
     * A function that determines whether or not a row should be ignored.
     * If the function returns `true` for a row, then that row will be ignored.
     */
    ignoreRows?: (row: RowShape) => boolean;
    /**
     * When {@link matchWithAlias filtering} and {@link Data.groupBy grouping} data, it can be useful to treat different valueus as if they were the
     * same, particularly if the source data is inconsistent.
     *
     * Each element in this array is an array of strings, where each string is treated as being equaul to
     * each other string in the array when filtering the data.
     *
     * @example
     * ```typescript
     * [
     *     ['New Zealand', 'NZ'],
     *     ['Australia', 'AU'],
     * ]
     * ```
     */
    aliases?: string[][];
};
/**
 * This function doesn't do anything itself, it just returns the object passed to it. However,
 * when working with TypeScript using a function in this way is necessary in order for the
 * TypeScript compiler to correctly infer the generic type based on the specified column names
 * for the data.
 *
 * @see {@link https://stackoverflow.com/a/70211076/1710523}
 */
export declare function fileConfig<RowShape extends Record<string, unknown>>(fileConfig: FileConfig<keyof RowShape & string, RowShape>): FileConfig<keyof RowShape & string, RowShape>;
export {};

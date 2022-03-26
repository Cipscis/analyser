/**
 * Convert a column heading from spreadsheet software to its integer representation. For example, converts 'A' to 0, or 'ZE' to 680.
 *
 * If a non-negative integer is passed, it will be returned untransformed. Any other value, including an invalid string, will return null.
 */
declare function getColNumber<T extends number>(colName: T): T | null;
declare function getColNumber<T extends string>(colName: T): number | null;
declare function getColNumber<T extends number | string>(colName: T): number | null;
/**
 * Converts a map of column names to column identifiers using getColNumbers so all column identifiers are integers.
 *
 * Any columns with invalid identifiers will be removed from the result.
 */
declare function getColNumbers<T extends string>(colsConfig: Record<T, number | string>): Record<T, number>;
export { getColNumber, getColNumbers, };

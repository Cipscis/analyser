// Type-only imports to make symbols available to JSDoc.
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { boolean } from './boolean';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { number } from './number';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { value } from './value';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { array } from './array';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { enumValue } from './boolean';

/**
 * Type functions are used to convert strings in a CSV file into typed data
 * that can be further analysed.
 *
 * For mmomst types, you can use one of the type functions provided by Analyser.
 *
 * For more complex data, though, you may need to create a custom type function.
 * These functions always take a string argument, and should throw an error if
 * that string doesn't match whatever requirements it might have to correctly
 * convert it to the desired type.
 *
 * @param val The value to be transformed
 * @param [locationIdentifier] A string used to identify the location of the value,
 * if an error is thrown
 *
 * @returns The transformed value
 *
 * @throws Throws an error if the input value doesn't match expectations
 *
 * @see {@linkcode boolean}
 * @see {@linkcode number}
 * @see {@linkcode value}
 * @see {@linkcode array}
 * @see {@linkcode enumValue}
 */
export interface TypeFn<T> {
	(value: string, locationIdentifier?: string): T;
}

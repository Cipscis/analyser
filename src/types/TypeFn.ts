// Type-only imports to make symbols available to JSDoc.
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { boolean, booleanCustom } from './boolean';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { number } from './number';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { value } from './value';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { array, ExtendableArrayTypeFn } from './array';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { enumValue } from './enumValue';

/**
 * Type functions are used to convert strings in a CSV file into typed data
 * that can be further analysed.
 *
 * For most types, you can use one of the type functions provided by Analyser.
 *
 * For more complex data, though, you may need to create a custom type function.
 * These functions always take a string argument, and should throw an error if
 * that string doesn't match whatever requirements it might have to correctly
 * convert it to the desired type.
 *
 * @param val The value to be transformed
 *
 * @returns The transformed value
 *
 * @throws Throws an error if the input value doesn't match expectations
 *
 * @see {@linkcode string}
 * @see {@linkcode number}
 * @see {@linkcode boolean}
 * @see {@linkcode booleanCustom}
 * @see {@linkcode value}
 * @see {@linkcode array}
 * @see {@linkcode ExtendableArrayTypeFn.of|array().of}
 * @see {@linkcode enumValue}
 */
export type TypeFn<T> = (value: string) => T;

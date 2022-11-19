import { TypeFn } from './TypeFn.js';
/**
 * Creates a function to extract a boolean value frorm a string representation using custom tests for truthiness and falsiness.
 *
 * If the value doesn't match either test, a warning will be generated.
 */
export declare function booleanCustom(truthy: string | RegExp, falsey: string | RegExp): TypeFn<boolean>;
/**
 * Extracts a boolean value from a string representation, if it contains one.
 *
 * If the value doesn't appear like it represents a boolean, a warning will be generated.
 */
export declare const boolean: TypeFn<boolean>;

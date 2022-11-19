import { TypeFn } from './TypeFn.js';
/**
 * Extracts boolean or number values from string representations if appropriate.
 *
 * No warnings will be generated if the value doesn't appear like a boolean or number.
 */
export declare const value: TypeFn<boolean | number>;

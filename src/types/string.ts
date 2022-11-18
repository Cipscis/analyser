import { TypeFn } from './TypeFn.js';

/**
 * Leaves a string value unchanged
 */
export const string: TypeFn<string> = function string(value) { return value; };

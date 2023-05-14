import { TypeFn } from './TypeFn.js';
/**
 * Combines the {@linkcode boolean} and {@linkcode number} {@linkcode TypeFn type functions}.
 *
 * If a value looks like it contains a boolean, it will be converted to a boolean.
 * Otherwise, if it looks like it contains a number, it will be convered to a number.
 */
export declare const value: TypeFn<boolean | number>;

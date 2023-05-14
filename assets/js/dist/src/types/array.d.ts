import { TypeFn } from './TypeFn.js';
/**
 * Used to create a {@linkcode TypeFn type function} that converts a string into an array of strings.
 *
 * The arguments are the same as those used by {@linkcode String.prototype.split}.
 */
export declare function array(separator: string | RegExp, limit?: number): TypeFn<string[]>;

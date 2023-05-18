import { TypeFn } from './TypeFn.js';
/**
 * Used to modify a {@linkcode TypeFn type function} to allow empty cells to be converted to
 * some default value if they would have thrown an error otherwise.
 *
 * @example
 * ```typescript
 * // Converts 'true' to `true`, 'false' to `false`, and '' to `null`
 * const boolOrNull = types.withDefault(null, types.boolean);
 * ```
 */
export declare function withDefault<T, D>(defaultValue: D, typeFn: TypeFn<T>): TypeFn<T | D>;

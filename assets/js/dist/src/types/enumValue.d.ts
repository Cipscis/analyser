import { TypeFn } from './TypeFn.js';
/**
 * Used to create a custom {@linkcode TypeFn type function} that ensures that a value exists within
 * an object like a string {@link https://www.typescriptlang.org/docs/handbook/enums.html TypeScript enum}.
 *
 * @param [recodeMap]
 * By default, this function doesn't transform the values passed into it. Instead, it acts as a check that they
 * exist within the passed `enum`.
 *
 * However, this optional parameter can be used to transform strings that don't exist within the `enum` into
 * strings that are members. These transformations are applied *before* the value's membership is checked.
 * This can be particularly useful for data cleaning.
 *
 * If this argument is an `Iterable<[string, E]>`, such as a {@linkcode Map}, only the first matching entry will be used.
 */
export declare function enumValue<E extends string>(enums: Record<string, E>, recodeMap?: Record<string, E> | Iterable<[string, E]>): TypeFn<E>;

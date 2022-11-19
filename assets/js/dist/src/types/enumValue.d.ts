import { TypeFn } from './TypeFn.js';
/**
 * Checks that the value, if it exists, is a member of an enum.
 *
 * If a recoding map is passed, and it contains instructions for this value, it is recoded first.
 *
 * If the value exists but it is not a member of the enum and cannot be recoded, a warning will be generated.
 */
export declare function enumValue<E extends string>(enums: Record<string, E>, recodeMap?: Record<string, E> | Iterable<[string, E]>): TypeFn<E>;

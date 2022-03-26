export interface TransformerFn<T> {
    (value: string, locationIdentifier?: string): T extends any[] ? T : (T | null);
}
/**
 * Splits a string into an array using String.prototype.split
 */
export declare function array(separator: string | RegExp, limit?: number): TransformerFn<string[]>;
/**
 * Extracts a boolean value from a string representation using a custom definition.
 *
 *  If the value doesn't appear like it represents a boolean, a warning will be generated.
 */
export declare function booleanCustom(truthy?: string | RegExp, falsey?: string | RegExp): TransformerFn<boolean>;
/**
 * Extracts a boolean value from a string representation, if it contains one.
 *
 * If the value doesn't appear like it represents a boolean, a warning will be generated.
 */
export declare const boolean: TransformerFn<boolean>;
/**
 * Extracts a number from a string representation, if it contains one.
 * Strings ending with '%' are treated as percentages and divided by 100.
 *
 * If the value doesn't appear like it represents a number, a warning will be generated.
 */
export declare const number: TransformerFn<number>;
/**
 * Extracts boolean or number values from string representations if appropriate.
 *
 * No warnings will be generated if the value doesn't appear like a boolean or number.
 */
export declare const value: TransformerFn<boolean | number>;
/**
 * Checks that the value, if it exists, is a member of an enum.
 *
 * If the value does not exist, it is transformed to null.
 *
 * If a recoding map is passed, and it contains instructions for this value, it is recoded first.
 *
 * If the value exists but it is not a member of the enum and cannot be recoded,
 * a warning will be generated and null will be returned.
 */
export declare function enumValue<E extends string>(enums: Record<string, E>, recodeMap?: Record<string, E>): TransformerFn<E>;

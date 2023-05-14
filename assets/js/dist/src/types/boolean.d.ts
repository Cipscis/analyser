import { TypeFn } from './TypeFn.js';
/**
 * Used to create a custom {@linkcode TypeFn type function} for converting a string into boolean values.
 *
 * If a value matches the string or regular expression in the `truthy` argument, it will be converted to `true`.
 * Otherwise, if it matches the string or regular expression in the `falsey` argument, it will be converted to `false`.
 *
 * If strings are specified, the matching will be exact using `===`. If you need your match to be case-insensitive,
 * or to ignore leading or trailing whitespace, then use a regular expression instead.
 */
export declare function booleanCustom(truthy: string | RegExp, falsey: string | RegExp): TypeFn<boolean>;
/**
 * If a value is `'true'` or `'false'`, ignoring case and any leading or trailing whitespace,
 * then it is converted to the relevant boolean value.
 */
export declare const boolean: TypeFn<boolean>;

export declare type InnerType<T> = T extends Array<infer E> ? E : T;
/**
 * Check if an object is iterable
 */
export declare function isIterable<T = unknown>(testObj: unknown): testObj is Iterable<T>;

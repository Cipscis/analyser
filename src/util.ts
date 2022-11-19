export type InnerType<T> = T extends Array<infer E> ? E : T;

/**
 * Check if an object is iterable
 */
export function isIterable<T = unknown>(testObj: unknown): testObj is Iterable<T> {
	const obj = testObj as Iterable<T>;

	if (typeof obj[Symbol.iterator] !== 'function') {
		return false;
	}

	return true;
}

/**
 * A type transformer function to use when processing data.
 *
 * @param {string} val - The value to be transformed
 * @param {string} [locationIdentifier] - A string used to identify the location of the value, if an error is thrown
 *
 * @returns The transformed value
 */
export interface TypeFn<T> {
	(value: string, locationIdentifier?: string): T extends unknown[] ? T : (T | null);
}

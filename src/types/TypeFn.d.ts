/**
 * A type transformer function to use when processing data.
 *
 * If the input value doesn't match expectations, this function should throw an `Error`
 *
 * @param {string} val - The value to be transformed
 * @param {string} [locationIdentifier] - A string used to identify the location of the value, if an error is thrown
 *
 * @returns {T} The transformed value
 *
 * @throws {Error} Throws an error if the input value doesn't match expectations
 */
export interface TypeFn<T> {
	(value: string): T;
}

/**
 * Convert a column heading from spreadsheet software to its integer representation. For example, converts 'A' to 0, or 'ZE' to 680.
 *
 * If a non-negative integer is passed, it will be returned untransformed. Any other value, including an invalid string, will return null.
 */
function getColNumber<T extends number>(colName: T): T | null
function getColNumber<T extends string>(colName: T): number | null
function getColNumber<T extends number | string>(colName: T): number | null
function getColNumber<T extends number | string>(colName: T): number | null {
	if (typeof colName === 'number') {
		if (Number.isInteger(colName) && colName >= 0) {
			return colName;
		} else {
			return null;
		}
	} else if (colName === '') {
		return null;
	} else if (typeof colName !== 'string') {
		return null;
	}

	const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	let rowNumber = -1; // Adjust for 0-based counting

	const upperColName = colName.toUpperCase();
	for (let i = 0; i < upperColName.length; i++) {
		const char = upperColName[i];
		const charIndex = alphabet.indexOf(char);

		if (charIndex === -1) {
			// colName contains an invalid character
			return null;
		}

		rowNumber += (charIndex + 1) * Math.pow(alphabet.length, colName.length - (i+1));
	}

	return rowNumber;
}

/**
 * Converts a map of column names to column identifiers using getColNumbers so all column identifiers are integers.
 *
 * Any columns with invalid identifiers will be removed from the result.
 */
function getColNumbers<T extends string>(colsConfig: Record<T, number | string>): Record<T, number> {
	const newCols: Partial<Record<T, number>> = {};

	for (let key in colsConfig) {
		const value = colsConfig[key];
		const colNumber = getColNumber(value);

		if (typeof colNumber === 'number') {
			newCols[key] = colNumber;
		}
	}

	return newCols as Record<T, number>;
}

export {
	getColNumber,
	getColNumbers,
};

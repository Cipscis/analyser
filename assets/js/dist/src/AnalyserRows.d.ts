interface AnalyserRows {
    filter(...args: Parameters<typeof Array.prototype.filter>): this;
}
declare class AnalyserRows extends Array<unknown[]> {
    constructor(source?: unknown[][] | number);
    /**
     * Returns the specified column.
     */
    getCol(colNum: number): unknown[];
    /**
     * Adds a new column to AnalyserRows, and returns its index.
     */
    addCol<T>(creator: (row: any[], index: number) => T): number;
    addCol<T>(newRow: T[]): number;
}
export { AnalyserRows };

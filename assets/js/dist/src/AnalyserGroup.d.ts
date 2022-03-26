import { AnalyserRows } from './AnalyserRows.js';
/**
 * A function for summarising a set of AnalyserRows
 */
declare type AnalyserSummariser<T = any, G = any> = (rows: AnalyserRows, groupName: G) => T;
/**
 * A group of AnalyserSummariser functions
 */
declare type AnalyserSummarisers<SummaryName extends string> = Record<SummaryName, AnalyserSummariser>;
declare const defaultSummarisers: {
    readonly Count: (rows: AnalyserRows) => number;
};
declare type DefaultSummaryName = keyof typeof defaultSummarisers;
/**
 * A 2D array of the results of AnalyserSummariser functions applied to an AnalyserGroup of AnalyserRows,
 * able to be printed to the console using `console.table`.
 *
 * After the first header row, each row represents a set of AnalyserRows grouped by the value given in the first cell.
 * After the first column, each column represents a summary of a group of AnalyserRows. The name of the summary is given in the first cell.
 */
export declare type AnalyserSummary<SummaryName extends string> = [[unknown, ...SummaryName[]], ...[any, ...any[]][]];
interface AnalyserGroupOptions {
    discrete?: boolean;
}
export declare class AnalyserGroup extends Map<any, AnalyserRows> {
    #private;
    constructor(options?: AnalyserGroupOptions);
    /**
     * Create a 2D summary array that can be printed using console.table.
     */
    summarise(): AnalyserSummary<DefaultSummaryName>;
    summarise<SummaryName extends string>(summarisers: AnalyserSummarisers<SummaryName>): AnalyserSummary<SummaryName>;
}
export {};

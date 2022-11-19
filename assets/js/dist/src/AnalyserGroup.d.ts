import { Data } from './Data.js';
/**
 * A function for summarising a set of AnalyserRows
 */
declare type AnalyserSummariser<RowShape extends Record<string, unknown>, T = unknown, G = unknown> = (rows: Data<RowShape>, groupName: G) => T;
/**
 * A group of AnalyserSummariser functions
 */
declare type AnalyserSummarisers<RowShape extends Record<string, unknown>, SummaryName extends string> = Record<SummaryName, AnalyserSummariser<RowShape>>;
declare const defaultSummarisers: {
    readonly Count: <RowShape extends Record<string, unknown>>(rows: Data<RowShape>) => number;
};
declare type DefaultSummaryName = keyof typeof defaultSummarisers;
/**
 * A 2D array of the results of AnalyserSummariser functions applied to an AnalyserGroup of AnalyserRows,
 * able to be printed to the console using `console.table`.
 *
 * After the first header row, each row represents a set of AnalyserRows grouped by the value given in the first cell.
 * After the first column, each column represents a summary of a group of AnalyserRows. The name of the summary is given in the first cell.
 */
export declare type AnalyserSummary<SummaryName extends string> = [[unknown, ...SummaryName[]], ...[unknown, ...unknown[]][]];
interface AnalyserGroupOptions {
    discrete?: boolean;
}
export declare class AnalyserGroup<RowShape extends Record<string, unknown>> extends Map<unknown, Data<RowShape>> {
    #private;
    constructor(options?: AnalyserGroupOptions);
    /**
     * Create a 2D summary array that can be printed using console.table.
     */
    summarise(): AnalyserSummary<DefaultSummaryName>;
    summarise<SummaryName extends string>(summarisers: AnalyserSummarisers<RowShape, SummaryName>): AnalyserSummary<SummaryName>;
}
export {};

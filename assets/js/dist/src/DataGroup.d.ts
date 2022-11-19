import { Data } from './Data.js';
import { InnerType } from './util.js';
/**
 * A function for summarising a set of `Data`
 */
declare type Summariser<RowShape extends Record<string, unknown>, G = unknown, T = unknown> = (rows: Data<RowShape>, groupName: G) => T;
/**
  * A group of `Summariser` functions
  */
declare type Summarisers<SummaryName extends string, RowShape extends Record<string, unknown>> = Record<SummaryName, Summariser<RowShape>>;
declare const defaultSummarisers: {
    readonly Count: (rows: unknown[]) => number;
};
declare type DefaultSummaryName = keyof typeof defaultSummarisers;
/**
* A 2D array of the results of Summariser functions applied to an AnalyserGroup of Data,
* able to be printed to the console using `console.table`.
*
* After the first header row, each row represents a set of Data grouped by the value given in the first cell.
* After the first column, each column represents a summary of a group of Data. The name of the summary is given in the first cell.
*/
export declare type Summary<SummaryName extends string> = [[unknown, ...SummaryName[]], ...[unknown, ...unknown[]][]];
interface DataGroupOptions {
    discrete?: boolean;
}
export declare class DataGroup<RowShape extends Record<string, unknown>, ColName extends keyof RowShape> extends Map<InnerType<RowShape[ColName]>, Data<RowShape>> {
    #private;
    constructor(options?: DataGroupOptions);
    /**
     * Create a 2D summary array that can be printed using console.table.
     */
    summarise(): Summary<DefaultSummaryName>;
    summarise<SummaryName extends string>(summarisers: Summarisers<SummaryName, RowShape>): Summary<SummaryName>;
}
export {};

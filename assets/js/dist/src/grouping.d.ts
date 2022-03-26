import { AnalyserRows } from './AnalyserRows.js';
import { FilterResolverExtender } from './filtering.js';
import { AnalyserGroup } from './AnalyserGroup.js';
interface Grouper {
    (rows: AnalyserRows, colNum: number): AnalyserGroup;
    (rows: AnalyserRows, colNum: number, numGroups: number, right?: boolean): AnalyserGroup;
    (rows: AnalyserRows, colNum: number, splitPoints: number[], right?: boolean): AnalyserGroup;
}
/**
 * Creates a function that uses a FilterResolverExtender with an embedded
 * set of aliases, to create a summarisable group of AnalyserRows split
 * based on the specified column.
 */
declare function createGroupFn(by: FilterResolverExtender, aliases?: string[][]): Grouper;
export { createGroupFn, Grouper, };

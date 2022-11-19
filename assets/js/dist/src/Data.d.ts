import { DataGroup } from './DataGroup.js';
export interface Data<RowShape extends Record<string, unknown>> {
    filter(...args: Parameters<Array<RowShape>['filter']>): Data<RowShape>;
}
export declare class Data<RowShape extends Record<string, unknown>> extends Array<RowShape> {
    aliases?: string[][];
    constructor(source?: number | Array<RowShape>, aliases?: string[][]);
    /**
     * Creates a new `Data` object with an additional column
     */
    addCol<ColName extends string, T>(colName: ColName, creator: (row: RowShape, index: number, data: RowShape[]) => T): Data<RowShape & Record<ColName, T>>;
    addCol<ColName extends string, T>(colName: ColName, newRow: T[]): Data<RowShape & Record<ColName, T>>;
    /**
     * Create a `DataGroup` for data in a given column
     */
    groupBy<ColName extends keyof RowShape>(colName: ColName): DataGroup<RowShape, ColName>;
    groupBy<ColName extends keyof RowShape>(colName: ColName, numGroups: number, right?: boolean): DataGroup<RowShape, ColName>;
    groupBy<ColName extends keyof RowShape>(colName: ColName, splitPoints: number[], right?: boolean): DataGroup<RowShape, ColName>;
}

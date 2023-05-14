import { DataGroup } from './DataGroup.js';
export interface Data<RowShape extends Record<string, unknown>> {
    filter(...args: Parameters<Array<RowShape>['filter']>): Data<RowShape>;
}
/**
 * This class extends the native {@linkcode Array} class. For most purposes, it can be treated
 * the same as any regular `Array`, for example by calling methods such as {@linkcode Array.prototype.filter}.
 *
 * The key difference between `Data` and a native `Array` is that, if the data was processed with a set
 * of {@link FileConfig.aliases aliases}, these aliases will be preserved in the {@linkcode Data.aliases aliases}
 * property.
 *
 * @see {@linkcode loadFile} for how to create `Data` objects.
 * @see {@linkcode matchWithAlias} for how to filter string data in a way that respects aliases
 */
export declare class Data<RowShape extends Record<string, unknown>> extends Array<RowShape> {
    /**
     * If {@linkcode loadFile} was called with a {@linkcode FileConfig} that contained an
     * {@linkcode FileConfig.aliases aliases} property, those aliases are preserved here.
     * This makes them available to be used with the {@linkcode matchWithAlias} method.
     */
    aliases?: string[][];
    constructor(source?: number | Array<RowShape>, aliases?: string[][]);
    /**
     * This method is used to add a new row to a `Data` object.
     *
     * To ensure proper type inference when working with TypeScript, this returns a new `Data`
     * object that contains the new column.
     *
     * There are two overloads available. The primary overload relies on a `creator` function,
     * which works similarly to a function passed to {@linkcode Array.prototype.map}. This
     * `creator` function takes a single row object and that row's index, and creates the valueu
     * that row should have in the new column.
     *
     * The second overload simply passes a newly constructed column in its entirety, as an array.
     * This array must be of the same length as the `Data` object being added to.
     */
    addCol<ColName extends string, T>(colName: ColName, creator: (row: RowShape, index: number, data: RowShape[]) => T): Data<RowShape & Record<ColName, T>>;
    addCol<ColName extends string, T>(colName: ColName, newRow: T[]): Data<RowShape & Record<ColName, T>>;
    /**
     * This method is used for grouping rows in a {@linkcode Data} object.
     *
     * These groups can then be used to produce summaries of the data, which in turn can be used to create graphs.
     *
     * This method effectively has any {@linkcode FileConfig.aliases aliases} baked in, with any values
     * in a set of aliases treated as though they were the first value in that set. That first value does not need
     * to appear in the data, but it will always be used in any {@linkcode DataGroup} created by this method.
     *
     * `groupBy` has three overrides.
     *
     * When grouping by discrete data, thie first override that only specifies a `colName` should always be used.
     * The other two overrides provide different methods for dividing continuous data into groups.
     *
     * If the `numGroups` argument is provided with a number, continuous data will be split into that many groups
     * of the same range. For example, if the data ranges from `0` to `100` and the `numGroups` argument is `5`,
     * the first group would contain data from `0` to `20`.
     *
     * Otherwise, the `splitPoints` argument can be provided with an array of numbers, which will be used as the
     * points where the groups will be split.
     *
     * For both of the continuous data overloads, there is an optional `right` argument that determines which end
     * of a group is open. If `right` is `true` (its default value), then values equal to the upper limit of a group
     * will be included. Otherwise, values equal to a group's lower limit will be included instead.
     *
     * However, the first and last groups will always include values at their outer boundaries, since they will be
     * determined based on the minimum and maximum values in the data set.
     */
    groupBy<ColName extends keyof RowShape>(colName: ColName): DataGroup<RowShape, ColName>;
    groupBy<ColName extends keyof RowShape>(colName: ColName, numGroups: number, right?: boolean): DataGroup<RowShape, ColName>;
    groupBy<ColName extends keyof RowShape>(colName: ColName, splitPoints: number[], right?: boolean): DataGroup<RowShape, ColName>;
}

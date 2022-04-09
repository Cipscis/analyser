declare type FilterInput = ((value: unknown) => boolean) | unknown[] | Exclude<unknown, []>;
/**
 * A function used by Array.prototype.filter
 */
interface FilterResolver {
    (val: unknown[], index: number, arr: unknown[][]): boolean;
}
/**
 * A FilterResolver that can be extended using FilterResolverExtender methods
 */
interface ExtensibleFilterResolver extends FilterResolver {
    andBy: FilterResolverExtender;
    orBy: FilterResolverExtender;
}
/**
 * A function that either creates a new FilterResolver or extends and existing one, embedding information about the column to look at and the values to match.
 */
interface FilterResolverExtender {
    (colIndex: number, values: FilterInput): ExtensibleFilterResolver;
}
/**
 * Creates a function that remembers a set of aliases, and can be called
 * to create a function that can be used with Array.prototype.filter to
 * use that alias when filtering a set of data using _applyFilter.
 */
declare function createFilterFn(aliases?: string[][]): FilterResolverExtender;
export { createFilterFn, FilterResolverExtender, ExtensibleFilterResolver, };

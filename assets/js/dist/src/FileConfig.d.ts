interface ColTypeFn<T> {
    (value: string, locationIdentifier?: string): T;
}
declare type ColConfig<RowShape extends Record<string, unknown>> = {
    [Col in keyof RowShape]: [string | number, ColTypeFn<RowShape[Col]>];
};
export declare type FileConfig<ColName extends string, RowShape extends Record<ColName, unknown>> = {
    path: string;
    cols: ColConfig<RowShape>;
    headerRows?: number;
    footerRows?: number;
    ignoreRows?: (row: RowShape) => boolean;
    aliases?: string[][];
};
export declare function fileConfig<RowShape extends Record<string, unknown>>(fileConfig: FileConfig<keyof RowShape & string, RowShape>): FileConfig<keyof RowShape & string, RowShape>;
export {};

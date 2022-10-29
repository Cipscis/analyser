interface ColTypeFn<T> {
	(value: string, locationIdentifier?: string): T;
}

type ColConfig<RowShape extends Record<string, unknown>> = {
	[Col in keyof RowShape]: [string | number, ColTypeFn<RowShape[Col]>]
}

export type FileConfig<
	ColName extends string,
	RowShape extends Record<ColName, unknown>,
> = {
	path: string;
	cols: ColConfig<RowShape>;

	headerRows?: number;
	footerRows?: number;
	ignoreRows?: (row: RowShape) => boolean;

	aliases?: string[][];
};

export function fileConfig<
	RowShape extends Record<string, unknown>,
>(fileConfig: FileConfig<keyof RowShape & string, RowShape>) {
	return fileConfig;
}

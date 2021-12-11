interface FileConfig<T extends string> {
	path: string,
	cols: Record<T, string | number>,

	headerRows?: number,
	footerRows?: number,

	aliases?: string[][],
	transform?: Partial<Record<T, (value: string, locationIdentifier?: string) => any>>,
}

/**
 * This function is a noop, but it's necessary to use a function here
 * in order for the TypeScript compiler to correctly infer the type of T
 */
const fileConfig = <T extends string>(fileConfig: FileConfig<T>) => fileConfig;

export { FileConfig, fileConfig };

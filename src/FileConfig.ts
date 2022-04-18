import { TransformerFn } from './transformers.js';

interface FileConfig<T extends string> {
	path: string,
	cols: Record<T, string | number>,

	headerRows?: number,
	footerRows?: number,
	ignoreRows?: (row: string[], cols: Record<T, number>) => boolean,

	aliases?: string[][],
	transform?: Partial<Record<T, TransformerFn<unknown>>>,
}

/**
 * Use this function when creating a FileConfig object.
 *
 * It is a noop function, but it's necessary to use a function here
 * in order for the TypeScript compiler to correctly infer the type of T
 */
const fileConfig = <T extends string>(fileConfig: FileConfig<T>) => fileConfig;

export { FileConfig, fileConfig };

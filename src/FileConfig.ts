interface FileConfig {
	path: string,
	cols: Record<string, string | number>,

	headerRows?: number,
	footerRows?: number,

	aliases?: string[][],
	transform?: Partial<Record<T, (value: string) => any>>,
}

export { FileConfig };

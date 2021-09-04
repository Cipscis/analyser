import { Cols } from './Cols.js';
import { Aliases } from './Aliases.js';

interface FileConfig {
	path: string,
	cols: Cols,

	headerRows?: number,
	footerRows?: number,

	aliases?: Aliases,
	transform?: {
		[key: string]: (value: any) => any,
	},
}

export { FileConfig };
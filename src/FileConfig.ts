import { Cols } from './Cols.js';
import { Aliases } from './Aliases.js';

interface FileConfig {
	path: string,
	cols: {
		[key: string]: string | number,
	},

	headerRows?: number,
	footerRows?: number,

	aliases?: Aliases,
	transform?: {
		[key: string]: (value: string) => any,
	},
}

export { FileConfig };

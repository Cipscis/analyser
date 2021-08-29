import { Cols } from './Cols';
import { Aliases } from './Aliases';

interface FileConfig {
	path: string,
	cols: Cols,

	headerRows?: number,
	footerRows?: number,

	aliases?: Aliases,
}

export { FileConfig };

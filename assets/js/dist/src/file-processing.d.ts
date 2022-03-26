import { FileConfig } from './FileConfig.js';
import { DataConfig } from './DataConfig.js';
/**
 * Load a single CSV file and process its contents, then return them.
 */
declare function loadFile<T extends string>(fileConfig: FileConfig<T>): Promise<DataConfig<T>>;
export { loadFile };

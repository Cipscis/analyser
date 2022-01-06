export { FileConfig, fileConfig } from './FileConfig.js';
export { DataConfig } from './DataConfig.js';

// Export type of AnalyserRows only, not the class itself
import { AnalyserRows as AnalyserRowsClass } from './AnalyserRows.js';
export type AnalyserRows = InstanceType<typeof AnalyserRowsClass>;

/////////////////////
// FILE PROCESSING //
/////////////////////
export { loadFile } from './file-processing.js';

//////////////////
// TRANSFORMERS //
//////////////////
export { TransformerFn } from './transformers.js';
export * as transformers from './transformers.js';

//////////////////////
// HELPER FUNCTIONS //
//////////////////////
export { getColNumber, getColNumbers } from './helpers.js';

//////////////
// GRAPHING //
//////////////
export { bar } from './charts/bar.js';

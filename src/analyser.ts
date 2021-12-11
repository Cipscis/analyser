export { fileConfig } from './FileConfig.js';

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
export * as transformers from './transformers.js';

//////////////////////
// HELPER FUNCTIONS //
//////////////////////
export { getColNumber, getColNumbers } from './helpers.js';

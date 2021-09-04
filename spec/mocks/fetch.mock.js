import { exampleA, exampleB, exampleC } from '../data/example.data.js';
import { exampleAConfig, exampleBConfig, exampleCConfig } from '../data/example.config.mjs';

const urlMap = {
	[exampleAConfig.path]: exampleA,
	[exampleBConfig.path]: exampleB,
	[exampleCConfig.path]: exampleC,
};

const fetch = async (url) => {
	return {
		ok: !!urlMap[url],
		text: () => urlMap[url],
	};
};

export { fetch };

import { exampleA, exampleB, exampleC } from '../data/example.data.js';

const urlMap = {
	'city example.csv': exampleA,
	'city example 2.csv': exampleB,
	'city example 3.csv': exampleC,
};

const fetch = async (url) => {
	return {
		ok: !!urlMap[url],
		text: () => urlMap[url],
	};
};

export { fetch };

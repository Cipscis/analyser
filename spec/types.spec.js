import { loadFile, types } from '../dist/index.js';

import { fetch } from './mocks/fetch.mock.js';
global.fetch = fetch;

import { exampleAConfig, exampleBConfig, exampleCConfig } from
'./data/example.config.js';

describe(`type functions`, () => {
	const testTypeFn = function (typeFn, expectedResults) {
		for (let [input, output] of expectedResults) {
			expect(typeFn(input)).toEqual(output);
		}
	};

	describe(`array`, () => {
		it(`splits a string into an array of strings`, async () => {
			const expectedResults = new Map([
				['Bus,Train', ['Bus', 'Train']],
			]);

			testTypeFn(types.array(','), expectedResults);
		});

		it(`can't be used directly as a type function`, async () => {
			const config = Object.assign({}, exampleAConfig);
			config.cols.publicTransport[1] = types.array;

			let errorThrown = false;
			try {
				await loadFile(config);
			} catch (e) {
				errorThrown = true;
			}

			expect(errorThrown).toBe(true);
		});

		it(`returns an empty array if passed an empty string`, async () => {
			const result = types.array(',')('');

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(0);
		});
	});

	describe(`array().of`, () => {
		it(`acts the same as \`array\` when using the \`string\` typeFn`, () => {
			const expectedResults = new Map([
				['Bus,Train', ['Bus', 'Train']],
			]);

			testTypeFn(
				types.array(',').of(types.string),
				expectedResults
			);
		});

		it(`converts a string into a typed array`, () => {
			const expectedResults = new Map([
				['1,2,3,4,5', [1, 2, 3, 4, 5]]
			]);

			testTypeFn(types.array(',').of(types.number), expectedResults);
		});
	});

	describe(`boolean`, () => {
		it(`extracts boolean values from strings`, () => {
			const expectedResults = new Map([
				['true', true],
				['false', false],
			]);

			testTypeFn(types.boolean, expectedResults);
		});

		it(`is case insensitive`, () => {
			const expectedResults = new Map([
				['True', true],
				['TRUE', true],
				['TrUe', true],
				['False', false],
				['FALSE', false],
				['FaLsE', false],
			]);

			testTypeFn(types.boolean, expectedResults);
		});

		it(`ignores leading or trailing whitespace`, () => {
			const expectedResults = new Map([
				[' true', true],
				['true ', true],
				['	true	', true],
				[' false', false],
				['false ', false],
				['	false	', false],
			]);

			testTypeFn(types.boolean, expectedResults);
		});

		it(`throws an error if the value can't be converted`, () => {
			const expectedResults = new Map([
				['another value', null],
			]);

			expect(() => testTypeFn(types.boolean, expectedResults)).toThrowError();
		});

		it(`doesn't throw an error if the value can be converted`, () => {
			const expectedResults = new Map([
				[' true', true],
				['true ', true],
				['	true	', true],
				[' false', false],
				['false ', false],
				['	false	', false],
			]);

			expect(() => testTypeFn(types.boolean, expectedResults)).not.toThrowError();
		});
	});

	describe(`booleanCustom`, () => {
		it(`allows strings to be used for custom truthy and falsey values`, () => {
			const expectedResults = new Map([
				['customTrue', true],
				['customFalse', false],
			]);
			const boolean = types.booleanCustom('customTrue', 'customFalse');

			testTypeFn(boolean, expectedResults);
		});

		it(`allows regular expressions to be used for custom truthy and falsey values`, () => {
			const expectedResults = new Map([
				['customTrue', true],
				['yes', true],
				['customFalseString', false],
				['Nooo', false],
			]);
			const boolean = types.booleanCustom(/true$|YES/i, /False|No/);

			testTypeFn(boolean, expectedResults);
		});

		it(`uses raw values when testing against regular expressions`, () => {
			const expectedResults = new Map([
				[' yes', true],
				[' NO', false],
			]);
			const boolean = types.booleanCustom(/ ye\w/, /\sNO/);

			testTypeFn(boolean, expectedResults);
		});

		it(`throws an error if the value can't be converted`, () => {
			const expectedResults = new Map([
				['yes', null],
				['NO', null],
			]);

			expect(() => testTypeFn(types.booleanCustom(/ ye\w/, /\sNO/), expectedResults)).toThrowError();
		});

		it(`doesn't throw an error if the value can be converted`, () => {
			const expectedResults = new Map([
				[' yes', true],
				[' NO', false],
			]);

			expect(() => testTypeFn(types.booleanCustom(/ ye\w/, /\sNO/), expectedResults)).not.toThrowError();
		});
	});

	describe(`number`, () => {
		it(`extracts plain numbers from strings`, () => {
			const expectedResults = new Map([
				['1000', 1000],
				['-3', -3],
				['+2.5', 2.5],
			]);

			testTypeFn(types.number, expectedResults);
		});

		it(`ignores commas in number strings`, () => {
			const expectedResults = new Map([
				['1,000', 1000],
				['1,0,0,0', 1000],
			]);

			for (let [input, output] of expectedResults) {
				expect(types.number(input)).toBe(output);
			}
		});

		it(`detects percentages`, () => {
			const expectedResults = new Map([
				['100%', 1],
				['10%', 0.1],
				['10.8%', 0.108],
				['81.23%', 0.8123],
			]);

			for (let [input, output] of expectedResults) {
				expect(types.number(input)).toBe(output);
			}
		});

		it(`throws an error if the value can't be converted`, () => {
			const expectedResults = new Map([
				['a100%', null],
				['a10%', null],
				['a10.8%', null],
				['a81.23%', null],
			]);

			expect(() => testTypeFn(types.number, expectedResults)).toThrowError();
		});

		it(`doesn't throw an error if the value can be converted`, () => {
			const expectedResults = new Map([
				['100%', 1],
				['10%', 0.1],
				['10.8%', 0.108],
				['81.23%', 0.8123],
			]);

			expect(() => testTypeFn(types.number, expectedResults)).not.toThrowError();
		});
	});

	describe(`value`, () => {
		it(`extracts boolean values from strings, if present`, () => {
			const expectedResults = new Map([
				['true', true],
				['True', true],
				[' false', false],
			]);

			testTypeFn(types.value, expectedResults);
		});

		it(`extracts number values from strings, if present`, () => {
			const expectedResults = new Map([
				['-1,000', -1000],
				['50.64%', 0.5064],
			]);

			testTypeFn(types.value, expectedResults);
		});

		it(`throws an error if the value can't be converted`, () => {
			const expectedResults = new Map([
				['test', null],
				['fifteen', null],
				['', null],
			]);

			expect(() => testTypeFn(types.value, expectedResults)).toThrowError();
		});

		it(`doesn't throw an error if the value can be converted`, () => {
			const expectedResults = new Map([
				['true', true],
				['True', true],
				[' false', false],
				['-1,000', -1000],
				['50.64%', 0.5064],
			]);

			expect(() => testTypeFn(types.value, expectedResults)).not.toThrowError();
		});
	});

	describe(`enumValue`, () => {
		// String enums are a TypeScript feature, but really they're just a Record<string, string>
		const testEnum = {
			test: 'test',
			val: 'val',
			['1']: '1',
		};

		it(`doesn't modify valid values`, () => {
			const expectedResults = new Map([
				[testEnum.test, testEnum.test],
				[testEnum.val, testEnum.val],
				[testEnum['1'], testEnum['1']],
			]);

			testTypeFn(types.enumValue(testEnum), expectedResults);
		});

		it(`throws an error if the value doesn't exist in the passed enum`, () => {
			const expectedResults = new Map([
				['another value', null],
			]);

			expect(() => testTypeFn(types.enumValue(testEnum), expectedResults)).toThrowError();
		});

		it(`doesn't throw an error if the value exists in the passed enum`, () => {
			const expectedResults = new Map([
				[testEnum.test, testEnum.test],
				[testEnum.val, testEnum.val],
				[testEnum['1'], testEnum['1']],
			]);

			expect(() => testTypeFn(types.enumValue(testEnum), expectedResults)).not.toThrowError();
		});

		it(`can transform values based on a recodeMap object`, () => {
			const expectedResults = new Map([
				[testEnum.test, testEnum.test],
				[testEnum.val, testEnum.val],
				[testEnum['1'], testEnum['1']],
				['another value', testEnum.val],
			]);

			expect(() => testTypeFn(types.enumValue(testEnum, { 'another value': testEnum.val }), expectedResults)).not.toThrowError();
		});

		it(`can transform values based on an iterable recodeMap`, () => {
			const expectedResults = new Map([
				[testEnum.test, testEnum.test],
				[testEnum.val, testEnum.val],
				[testEnum['1'], testEnum['1']],
				['another value', testEnum.val],
			]);

			expect(() => testTypeFn(types.enumValue(testEnum, new Map([['another value', testEnum.val]])), expectedResults)).not.toThrowError();
		});
	});

	describe(`withDefault`, () => {
		it(`can be combined with another type function, while converting empty strings to a default value`, () => {
			const expectedResults = new Map([
				['', null],
				['1000', 1000],
				['-3', -3],
				['+2.5', 2.5],
			]);

			testTypeFn(types.withDefault(null, types.number), expectedResults);
		});
	});
});

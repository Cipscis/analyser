import * as analyser from '../dist/analyser.js';

import { fetch } from './mocks/fetch.mock.js';
global.fetch = fetch;

import { exampleAConfig, exampleBConfig, exampleCConfig } from
'./data/example.config.js';

describe(`transformers`, () => {
	// Suppress console warnings during tests
	let consoleWarnSpy;
	beforeEach(() => {
		consoleWarnSpy = spyOn(console, 'warn');
	});

	const testTransformer = function (transformer, expectedResults) {
		for (let [input, output] of expectedResults) {
			expect(transformer(input)).toEqual(output);
		}
	};

	describe(`array`, () => {
		it(`splits a string into an array of strings`, async () => {
			const expectedOutput = new Map([
				['Bus,Train', ['Bus', 'Train']],
			]);

			testTransformer(analyser.transformers.array(','), expectedOutput);
		});

		it(`can't be used directly as a transformer`, async () => {
			const config = Object.assign({}, exampleAConfig);
			config.transform = {
				PUBLIC_TRANSPORT: analyser.transformers.array,
			};

			let errorThrown = false;
			try {
				const { rows } = await analyser.loadFile(config);
			} catch (e) {
				errorThrown = true;
			}

			expect(errorThrown).toBe(true);
		});
	});

	describe(`boolean`, () => {
		it(`extracts boolean values from strings`, () => {
			const expectedResults = new Map([
				['true', true],
				['false', false],
			]);

			testTransformer(analyser.transformers.boolean, expectedResults);
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

			testTransformer(analyser.transformers.boolean, expectedResults);
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

			testTransformer(analyser.transformers.boolean, expectedResults);
		});

		it(`converts other strings into null`, () => {
			(['', 'yes', 'no', 'test', '100', 'true a', 'falsey']).forEach((str) => expect(analyser.transformers.boolean(str)).toBe(null));
		});

		it(`generates a warning in the console if the value can't be converted`, () => {
			const expectedResults = new Map([
				['another value', null],
			]);

			testTransformer(analyser.transformers.boolean, expectedResults);

			expect(consoleWarnSpy).toHaveBeenCalled();
		});

		it(`doesn't generate a warning in the console if the value can be converted`, () => {
			const expectedResults = new Map([
				[' true', true],
				['true ', true],
				['	true	', true],
				[' false', false],
				['false ', false],
				['	false	', false],
			]);

			testTransformer(analyser.transformers.boolean, expectedResults);

			expect(consoleWarnSpy).not.toHaveBeenCalled();
		});
	});

	describe(`booleanCustom`, () => {
		it(`allows strings to be used for custom truthy and falsey values`, () => {
			const expectedResults = new Map([
				['customTrue', true],
				['customFalse', false],
			]);
			const boolean = analyser.transformers.booleanCustom('customTrue', 'customFalse');

			testTransformer(boolean, expectedResults);
		});

		it(`allows regular expressions to be used for custom truthy and falsey values`, () => {
			const expectedResults = new Map([
				['customTrue', true],
				['yes', true],
				['customFalseString', false],
				['Nooo', false],
			]);
			const boolean = analyser.transformers.booleanCustom(/true$|YES/i, /False|No/);

			testTransformer(boolean, expectedResults);
		});

		it(`uses cleaned values (case insensitive, no leading or trailing whitespace) when testing against strings`, () => {
			const expectedResults = new Map([
				[' True', true],
				['naH ', false],
			]);
			const boolean = analyser.transformers.booleanCustom('TRUE ', ' nah ');

			testTransformer(boolean, expectedResults);
		});

		it(`uses raw values when testing against regular expressions`, () => {
			const expectedResults = new Map([
				[' yes', true],
				[' NO', false],
			]);
			const boolean = analyser.transformers.booleanCustom(/ ye\w/, /\sNO/);

			testTransformer(boolean, expectedResults);
		});

		it(`transforms strings that don't match its expectations to null`, () => {
			const boolean = analyser.transformers.booleanCustom(/A/, /B/);
			(['', 'yes', 'no', 'test', '100', 'true a', 'falsey']).forEach((str) => expect(boolean(str)).toBe(null));
		});

		it(`generates a warning in the console if the value can't be converted`, () => {
			const expectedResults = new Map([
				['yes', null],
				['NO', null],
			]);

			testTransformer(analyser.transformers.booleanCustom(/ ye\w/, /\sNO/), expectedResults);

			expect(consoleWarnSpy).toHaveBeenCalled();
		});

		it(`doesn't generate a warning in the console if the value can be converted`, () => {
			const expectedResults = new Map([
				[' yes', true],
				[' NO', false],
			]);

			testTransformer(analyser.transformers.booleanCustom(/ ye\w/, /\sNO/), expectedResults);

			expect(consoleWarnSpy).not.toHaveBeenCalled();
		});
	});

	describe(`number`, () => {
		it(`extracts plain numbers from strings`, () => {
			const expectedResults = new Map([
				['1000', 1000],
				['-3', -3],
				['+2.5', 2.5],
			]);

			testTransformer(analyser.transformers.number, expectedResults);
		});

		it(`ignores commas in number strings`, () => {
			const expectedResults = new Map([
				['1,000', 1000],
				['1,0,0,0', 1000],
			]);

			for (let [input, output] of expectedResults) {
				expect(analyser.transformers.number(input)).toBe(output);
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
				expect(analyser.transformers.number(input)).toBe(output);
			}
		});

		it(`transforms strings that don't match its expectations to null`, () => {
			const boolean = analyser.transformers.number;
			(['', 'yes', 'no', 'test', 'a100', 'true a', 'falsey']).forEach((str) => expect(boolean(str)).toBe(null));
		});

		it(`generates a warning in the console if the value can't be converted`, () => {
			const expectedResults = new Map([
				['a100%', null],
				['a10%', null],
				['a10.8%', null],
				['a81.23%', null],
			]);

			testTransformer(analyser.transformers.number, expectedResults);

			expect(consoleWarnSpy).toHaveBeenCalled();
		});

		it(`doesn't generate a warning in the console if the value can be converted`, () => {
			const expectedResults = new Map([
				['100%', 1],
				['10%', 0.1],
				['10.8%', 0.108],
				['81.23%', 0.8123],
			]);

			testTransformer(analyser.transformers.number, expectedResults);

			expect(consoleWarnSpy).not.toHaveBeenCalled();
		});
	});

	describe(`value`, () => {
		it(`extracts boolean values from strings, if present`, () => {
			const expectedResults = new Map([
				['true', true],
				['True', true],
				[' false', false],
			]);

			testTransformer(analyser.transformers.value, expectedResults);
		});

		it(`extracts number values from strings, if present`, () => {
			const expectedResults = new Map([
				['-1,000', -1000],
				['50.64%', 0.5064],
			]);

			testTransformer(analyser.transformers.value, expectedResults);
		});

		it(`transforms strings to null if it can't extract a value`, () => {
			const expectedResults = new Map([
				['test', null],
				['fifteen', null],
				['', null],
				['true', true],
				['True', true],
				[' false', false],
				['-1,000', -1000],
				['50.64%', 0.5064],
			]);

			testTransformer(analyser.transformers.value, expectedResults);
		});

		it(`generates a warning in the console if the value can't be converted`, () => {
			const expectedResults = new Map([
				['test', null],
				['fifteen', null],
				['', null],
			]);

			testTransformer(analyser.transformers.value, expectedResults);

			expect(consoleWarnSpy).toHaveBeenCalled();
		});

		it(`doesn't generate a warning in the console if the value can be converted`, () => {
			const expectedResults = new Map([
				['true', true],
				['True', true],
				[' false', false],
				['-1,000', -1000],
				['50.64%', 0.5064],
			]);

			testTransformer(analyser.transformers.value, expectedResults);

			expect(consoleWarnSpy).not.toHaveBeenCalled();
		});
	});

	describe(`enumValue`, () => {
		// String enums are a TypeScript feature, but really they're just a Record<string, string>
		const testEnum = {
			test: 'test',
			val: 'val',
			['1']: '1',
		};

		it(`doesn't modify valid values, and converts invalid values to null`, () => {
			const expectedResults = new Map([
				[testEnum.test, testEnum.test],
				[testEnum.val, testEnum.val],
				[testEnum['1'], testEnum['1']],
				['another value', null],
			]);

			testTransformer(analyser.transformers.enumValue(testEnum), expectedResults);
		});

		it(`generates a warning in the console if the value doesn't exist in the passed enum`, () => {
			const expectedResults = new Map([
				['another value', null],
			]);

			testTransformer(analyser.transformers.enumValue(testEnum), expectedResults);

			expect(consoleWarnSpy).toHaveBeenCalled();
		});

		it(`doesn't generate a warning in the console if the value exists in the passed enum`, () => {
			const expectedResults = new Map([
				[testEnum.test, testEnum.test],
				[testEnum.val, testEnum.val],
				[testEnum['1'], testEnum['1']],
			]);

			testTransformer(analyser.transformers.enumValue(testEnum), expectedResults);

			expect(consoleWarnSpy).not.toHaveBeenCalled();
		});

		it(`can transform values based on a recodeMap`, () => {
			const expectedResults = new Map([
				[testEnum.test, testEnum.test],
				[testEnum.val, testEnum.val],
				[testEnum['1'], testEnum['1']],
				['another value', testEnum.val],
			]);

			testTransformer(analyser.transformers.enumValue(testEnum, { 'another value': testEnum.val }), expectedResults);

			expect(consoleWarnSpy).not.toHaveBeenCalled();
		});
	});
});

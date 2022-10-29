import { loadFile } from '../../../../src/new/index.js';
import * as types from '../../../../src/new/types/index.js';

import { fileConfig } from '../../../../src/new/FileConfig.js';

const config = fileConfig({
	path: '/assets/data/city example.csv',

	cols: {
		name: ['A', types.string],
		country: ['B', types.string],
		pop: ['C', types.number],
	},

	aliases: [
		['Aotearoa', 'New Zealand'],
	],

	headerRows: 1,
	ignoreRows: (row) => row.name === 'Total',
});

loadFile({
	path: '/assets/data/city example.csv',

	cols: {
		name: ['A', types.string],
		country: ['B', types.string],
		pop: ['C', types.number],
	},

	headerRows: 1,
	ignoreRows: (row) => row.name === 'Total',
}).then((processedData) => {
// loadFile(config).then((processedData) => {
	const rows = processedData.rows;
	const matchAlias = processedData.matchAlias;

	console.log(rows);

	console.log(rows.filter(
		(row) => matchAlias(row.country, 'New Zealand')
	));

	rows.filter((row) => row.pop && row.pop > 50);
});






// import * as codebook from '@cipscis/codebook';

// import * as csv from '@cipscis/csv';
// import * as analyser from '@cipscis/analyser';

// const selectors = Object.freeze({
// 	example: '.js-docs__example',
// 	block: '.js-docs__example .js-codebook__block[contenteditable]',
// 	run: '.js-docs__run',
// 	log: '.js-docs__log',

// 	codebookSet: '.js-codebook__set',
// } as const);

// const dataAttributes = Object.freeze({
// 	codebookSet: 'data-codebook-set',
// } as const);

// const classes = Object.freeze({
// 	error: 'docs-example__control--error',
// } as const);

// let $currentBlock: HTMLElement | null = null;

// function init() {
// 	_initEvents();

// 	_runInitialSets();
// }

// function _initEvents() {
// 	const $runSetButtons = document.querySelectorAll<HTMLElement>(selectors.run);
// 	$runSetButtons.forEach(($runSetButton) => {
// 		$runSetButton.addEventListener('click', _runSetEvent);
// 	});

// 	const $blocks = document.querySelectorAll<HTMLElement>(selectors.block);
// 	$blocks.forEach(($block) => {
// 		$block.addEventListener('blur', _clearCurrentBlock);
// 		$block.addEventListener('input', _markAsCurrentBlock);
// 		$block.addEventListener('keydown', _markAsCurrentBlockOnArrowDown);
// 	});
// 	document.addEventListener('keydown', _handleTabInsertion);
// }

// function _runInitialSets() {
// 	codebook.tidy();

// 	codebook.runSet('example-data', { csv });
// }

// function _runSetEvent(this: HTMLElement, e: MouseEvent) {
// 	const $runSetButton = this;
// 	const $set = $runSetButton.closest(selectors.codebookSet);
// 	const setName = $set?.getAttribute(dataAttributes.codebookSet);

// 	$runSetButton.setAttribute('aria-busy', 'true');

// 	const args = { csv, analyser };
// 	const promise = setName ? codebook.runSet(setName, args) : codebook.runSet(args);

// 	promise
// 		.then(() => {
// 			$runSetButton.classList.remove(classes.error);
// 		})
// 		.catch((reason) => {
// 			$runSetButton.classList.add(classes.error);
// 			const $example = $runSetButton.closest(selectors.example);
// 			const $log = $example?.querySelector(selectors.log);

// 			if ($log) {
// 				console.error(reason);
// 				$log.innerHTML = reason.toString();
// 			}
// 		})
// 		.finally(() => {
// 			$runSetButton.setAttribute('aria-busy', 'false');
// 		});
// }

// function _markAsCurrentBlock(this: HTMLElement, e: Event) {
// 	$currentBlock = this;
// }

// function _markAsCurrentBlockOnArrowDown(this: HTMLElement, e: KeyboardEvent) {
// 	if (
// 		e.key === 'ArrowUp' ||
// 		e.key === 'ArrowRight' ||
// 		e.key === 'ArrowDown' ||
// 		e.key === 'ArrowLeft'
// 	) {
// 		_markAsCurrentBlock.call(this, e);
// 	}
// }

// function _clearCurrentBlock(this: HTMLElement, e: FocusEvent) {
// 	$currentBlock = null;
// }

// function _handleTabInsertion(this: Document, e: KeyboardEvent) {
// 	if (e.key !== 'Tab') {
// 		return;
// 	}

// 	if ($currentBlock === null) {
// 		return;
// 	}

// 	e.preventDefault();

// 	const selection = this.getSelection();
// 	const range = selection?.getRangeAt(0);
// 	if (range) {
// 		range.deleteContents();
// 		range.insertNode(document.createTextNode('\t'));
// 		range.collapse(false);
// 	}
// }

// init();

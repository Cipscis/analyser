import * as codebook from '@cipscis/codebook';

import * as csv from '@cipscis/csv';
import * as analyser from '@cipscis/analyser';

const selectors = Object.freeze({
	example: '.js-docs__example',
	run: '.js-docs__run',
	log: '.js-docs__log',

	codebookSet: '.js-codebook__set',
} as const);

const dataAttributes = Object.freeze({
	codebookSet: 'data-codebook-set',
} as const);

const classes = Object.freeze({
	error: 'docs-example__control--error',
} as const);

function init() {
	_initEvents();

	_runInitialSets();
}

function _initEvents() {
	const $runSetButtons = document.querySelectorAll<HTMLElement>(selectors.run);

	$runSetButtons.forEach(($runSetButton) => {
		$runSetButton.addEventListener('click', _runSetEvent);
	});
}

function _runInitialSets() {
	codebook.tidy();

	codebook.runSet('example-data', { csv });
}

function _runSetEvent(this: HTMLElement, e: MouseEvent) {
	const $runSetButton = this;
	const $set = $runSetButton.closest(selectors.codebookSet);
	const setName = $set?.getAttribute(dataAttributes.codebookSet);

	$runSetButton.setAttribute('aria-busy', 'true');

	const args = { csv, analyser };
	const promise = setName ? codebook.runSet(setName, args) : codebook.runSet(args);

	promise
		.then(() => {
			$runSetButton.classList.remove(classes.error);
		})
		.catch((reason) => {
			$runSetButton.classList.add(classes.error);
			const $example = $runSetButton.closest(selectors.example);
			const $log = $example?.querySelector(selectors.log);

			if ($log) {
				$log.innerHTML = reason.toString();
			} else {
				console.error(reason);
			}
		})
		.finally(() => {
			$runSetButton.setAttribute('aria-busy', 'false');
		});
}

init();

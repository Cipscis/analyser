# How to use

*Delete this section when you first update this file.*

Whenever you update your package, you should create a new version. And important part of this is documenting changes you have made in a human-readable way. This file provides a convenient place for tracking changes.

See [https://keepachangelog.com/en/](keepachangelog.com) for a good guide on how to write a change log.

Change log entries should have a version number, a date, and subsections detailing changes of each of these types:

* `Added`
* `Changed`
* `Deprecated`
* `Removed`
* `Fixed`
* `Security`

---

# Base Package Changelog

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

* Added framework for a [Jasmine](https://jasmine.github.io/) test suite.

### Changed

* Moved change log into `CHANGELOG.md`.
* Updated build system to use module syntax.

## [2.0.2] - 2021-05-29

### Changed

* Reconfigured Webpack to use the `eval-source-map` devtool in development mode.

### Fixed

* Fixed a build system error.

## [2.0.1] - 2021-05-26

### Changed

* Moved documentation into `main` branch.

## [2.0.0] - 2021-05-25

### Changed

* `loadFile` was reworked significantly. It now takes an array of fileInfo objects that are expected to include a `path` string, and returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

### Removed

* Old versions of functions that could previously be called either as methods of `analyser` or as methods of an instance of `AnalyserRows` are no longer directly available on `analyser`.

## [1.0.0] - 2021-05-25

### Added

* Initial commit, base on [Charter](https://github.com/cipscis/charter).

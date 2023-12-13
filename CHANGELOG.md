# @nodecfdi/cfdiutils-common ChangeLog

## 2.0.0

### Major Changes - Rename of files to standard of xo and sync with phpcfdi

- Update dependencies
- Change from Eslint to XO (a wrapped shared eslint config with steroids)
- Update bundle generator to library and outputs types
- Rename files and classes to follow xo standard guide
- Prepare lib for drop support to Commonjs (Q2 2024)

## 1.2.6

### Patch Changes - Fixed correct iteration element-chilnodes and attributes

- Update dependencies
- Fixed correct iteration of element childNodes and attributes

## 1.2.5

### Patch Changes - Maintenance and Small Optimizations

- Update dependencies
- Update types exports for typescript module and commonjs
- Update to ESM support
- Update CI workflow for fix pipeline to latest github and pnpm changes
- Increment code coverage
- Drop support to node versions < 16

## 1.2.4

### Patch Changes - Update dependencies and maintenance in general

- Update README.md with missing pnpm installation and browser usage
- Fixed CI error
- Fixed exports for support commonjs and module type correctly
- Fixed generate types (typescript)
- Update dependencies

## 1.2.3

### Fixed export iife for browser usage

- update imports and require for include browser global iife export

## 1.2.2

### Patch Changes on development and build

- change build tool
- update dependencies
- added api-extractor for check types .d.ts
- replace microbundle for tsup
- replace jest for vitest (added support to multiple environment tests like a node and browser)

## 1.2.1

### Patch Changes

- fixed types resolution to relative path (typescript usage)

## 1.2.0

### Minor Changes

- ab38a00: DOM agnostic

  ***

  - Add helper for install and use anything DOM implementation class.
  - Improve documentation about new process to use `XML` and `XmlNodeUtils` helper classes.

                    CI

  - Update workflow for use pnpm and better test coverage.
  - Added Sonarcloud for better continuous code quality.

                    Build

  - Replace rollup bundle for microbundle for generation of library.

## 1.1.0

- Introduce `CNodeHasValueInterface` to work with nodes simple text content.
- The class `CNode` implements `CNodeHasValueInterface`.
- The XML node importers and exporters now can read and write simple text content.

## 1.0.1

- fix: added missing methods on CNodeInterface
- fix again CAttributes, CNode for work has expected.
- update interface CNodeInterface to include last methods added

## 1.0.0

- Happy to announce release stable version
- Added last fixes for work has expected
- Updated dependencies
- Fixed bad set ang get on `CAttributes`
- Added Map Accessors on `CNode`

## 0.4.0

- Add Util Helper CurrencyDecimals
- Added more rules to eslint
- Fixed typo missing
- Update dependencies

## 0.3.0

- Add ES6 build, use Rollup 2.60.2
- Increment strict on eslint and config with prettier
- Added docs generator and better typescript typo

## 0.2.0

- Add Xml utilities
- Add DomValidators
- Update dependencies

## 0.1.0

- First release

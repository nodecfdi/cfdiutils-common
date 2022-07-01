# @nodecfdi/cfdiutils-common ChangeLog

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

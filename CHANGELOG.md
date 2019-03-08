# Change Log
All notable changes to the "stackstorm-vscode" extension will be documented in this file.

## \[1.3.0] - 2019-03-08
### Added
*   Added a output channel to display logging information if errors occur.

### Fixed
*   Fixed issue with pack not generating a pack.yaml file if the author and email setting were not set. Issue number #23

## \[1.2.0] - 2019-03-06
### Added
*   Added Bootstrap Folder to create a pack layout from scratch

## \[1.1.1] - 2019-03-06
### Fixed
*   #18 - Fixed the generating of templates. This was tested however on a fresh install this did not work.

## \[1.1.0] - 2019-03-04
### Added
*   Added 'st2.defaultAuthor' setting which can be used to fill out the pack.yaml file.
*   Added 'st2.defaultEmail' setting which can be used to fill out the pack.yaml file.
*   Stackstorm logo.

### Fixed
*   Fixed issues with promises in the code.
*   Complied to TsLint rules.
*   Change github link in package.json file.

## \[1.0.0] - 2019-03-01
### Added
#### General
*   Added basic testing via Travis CI.

#### Context Menu Actions
*   Added action template generator.
*   Added alias template generator.
*   Added policy template generator.
*   Added rule template generator.
*   Added sensor template generator.
*   Added workflow template generator.

### Fixed
*   Pack config file not generating.
*   Removed redundent code

## \[0.0.2] - 2019-03-01
### Added
*   Generate README file for pack. User requested to input the name of the pack which is then filled in at the top of the README.

## \[0.0.1]
*   Initial release

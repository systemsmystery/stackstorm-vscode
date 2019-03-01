# Stackstorm VS Code

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/systemsmystery.stackstorm-vscode.svg?style=flat-square)
![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/systemsmystery.stackstorm-vscode.svg?style=flat-square)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/systemsmystery.stackstorm-vscode.svg?style=flat-square)
[![Travis CI](https://img.shields.io/travis/systemsmystery/stackstorm-vscode.svg?style=flat-square)](https://travis-ci.org/user/repository)
[![GitHub](https://img.shields.io/github/issues/systemsmystery/stackstorm-vscode.svg?style=flat-square)](https://github.com/systemsmystery/stackstorm-vscode/issues)
[![GitHub](https://img.shields.io/github/release/systemsmystery/stackstorm-vscode.svg?style=flat-square)](https://github.com/systemsmystery/stackstorm-vscode/releases)

This extension adds the ability to create the required files for a Stackstorm pack in a VS Code Workspace.
 > Inspired by VS Code Angular Files (https://github.com/ivalexa/vscode-angular2-files/)

 > This plugin has no association with Stackstorm.org

## Features

Right click within the explorer to create:

* Pack Config Template - `pack.yaml` file required for a pack.
* Config Schema Template - `config.schema.yaml` file required if using config values within a pack.
* Action Metadata Template - `action.yaml` file which is required to register a action with Stackstorm.
* Workflow Metadata Template - `workflow.yaml` file which is used to describe a particular workflow.

![Overview](images/overview.gif)

## Note

This extension should not overwrite any files that already exist, however this is not a guarentee. I will not be help responsible for any data loss.

## Release Notes

Detailed change log can be found [here](CHANGELOG.md).
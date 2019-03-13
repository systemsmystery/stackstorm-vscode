import { writeStandardTemplate, writeReadMe } from '../src/functions'
import { StandardCommandMappings } from '../src/mappings/CommandMappings'
import { readFileSync, existsSync, mkdirSync, removeSync, pathExistsSync } from 'fs-extra'
import { join } from 'path'
import { TlFolder } from '../src/enums/folders'
import { TemplateFile } from '../src/enums/template'
import { bootstrapFolders } from '../src/bootstrap-function'
import * as assert from 'assert'
import * as sinon from 'sinon'
import * as vscode from 'vscode'

describe('Check bootstrap script', function () {
  let testFolder = join(__dirname, 'testing-space')
  before('Create bootstrap test folder', function () {
    mkdirSync(testFolder)
    bootstrapFolders(testFolder).catch(error => {
      vscode.window.showErrorMessage(error)
    })
  })
  describe('Check that folder structure is created', function () {
    for (let folder in TlFolder) {
      const checkFolder: TlFolder = TlFolder[folder] as TlFolder
      it(`Check top level folder ${checkFolder} exist`, function () {
        let result = pathExistsSync(join(testFolder, checkFolder))
        assert.strictEqual(result, true)
      })
    }
  })
  after('Cleanup test folder', function () {
    removeSync(testFolder)
  })
})

import { mkdirSync, removeSync, pathExistsSync } from 'fs-extra'
import { readFile, accessSync, access } from 'fs'
import { join } from 'path'
import { TlFolder } from '../src/enums/folders'
import { BootstrapFiles } from '../src/mappings/SubFolderMappings'
import { createFolderStructure, writeStandardBootstrapFiles, setBootstrapDirectory, checkDirectoryContent } from '../src/bootstrap-function'
import * as assert from 'assert'
import * as sinon from 'sinon'
import * as vscode from 'vscode'
import * as emptyDir from 'empty-dir'

describe('Check bootstrap script', function () {
  let testFolder = join(__dirname, 'testing-space')
  before('Create bootstrap test folder', function (done) {
    mkdirSync(testFolder)
    createFolderStructure(testFolder)
    writeStandardBootstrapFiles(testFolder)
    done()
  })
  describe('Check setBootstrapDirectory function', function () {
    if (vscode.workspace.workspaceFolders !== undefined) {
      console.log(vscode.workspace.workspaceFolders[0].uri.fsPath)
    }
    it('Check that an error occurse when no workspace is open', function () {
      let rootFolder = sinon.stub(vscode.workspace, 'workspaceFolders').value(undefined)
      try {
        setBootstrapDirectory()
      } catch (err) {
        assert.strictEqual(err.message, 'No workspace open or folder specified')
      }
      rootFolder.restore()
    })
    it('Check that the directory is returned if specified', function () {
      let rootFolder
      try {
        rootFolder = setBootstrapDirectory('testing-space')
        assert.strictEqual(rootFolder, 'testing-space')
      } catch (error) {
        console.log(error)
      }
    })
    it('Check that the workspace is returned if no directory is specified', function () {
      let actualWorkspace
      let result
      if (vscode.workspace.workspaceFolders !== undefined) {
        actualWorkspace = vscode.workspace.workspaceFolders[0].uri.fsPath
      }
      try {
        result = setBootstrapDirectory()
        assert.strictEqual(result, actualWorkspace)
      } catch (error) {
        console.log(error)
      }
    })
    it('Check that when directory is empty it returns true', function () {
      let result
      let mockEmptyDir = sinon.stub(emptyDir, 'sync').returns(true)
      result = checkDirectoryContent(__dirname)
      mockEmptyDir.restore()
      assert.strictEqual(result, true)
    })
    it('Check that when directory is not empty it returns false', function () {
      let result
      let mockNonEmptyDir = sinon.stub(emptyDir, 'sync').returns(false)
      result = checkDirectoryContent(__dirname)
      mockNonEmptyDir.restore()
      assert.strictEqual(result, false)
    })

  })
  describe('Check that folder structure is created', function () {
    for (let folder in TlFolder) {
      const checkFolder: TlFolder = TlFolder[folder] as TlFolder
      it(`Check top level folder ${checkFolder} exist`, function (done) {
        let result = pathExistsSync(join(testFolder, checkFolder))
        assert.strictEqual(result, true)
        done()
      })
    }
  })
  describe('Check standard files are created', function () {
    for (const [key, value] of BootstrapFiles) {
      it(`Check ${value.filename} has been created in ${value.destination}`, function (done) {
        let filePath = join(testFolder, value.destination, value.filename)
        let result: boolean
        try {
          accessSync(filePath)
          result = true
        } catch (err) {
          result = false
        }
        assert.strictEqual(result, true)
        done()
      })
    }
  })
  after('Cleanup test folder', function () {
    removeSync(testFolder)
  })
})

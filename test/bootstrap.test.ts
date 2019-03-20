import { mkdirSync, removeSync, pathExistsSync } from 'fs-extra'
import * as fs from 'fs'
import { join } from 'path'
import { TlFolder } from '../src/enums/folders'
import { BootstrapFiles } from '../src/mappings/SubFolderMappings'
import { createFolderStructure, writeStandardBootstrapFiles, setBootstrapDirectory, checkDirectoryContent, getPackInfo } from '../src/bootstrap-function'
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
    it('Check that an error occurse when no workspace is open', function (done) {
      let rootFolder = sinon.stub(vscode.workspace, 'workspaceFolders').value(undefined)
      try {
        setBootstrapDirectory()
      } catch (err) {
        assert.strictEqual(err.message, 'No workspace open or folder specified')
      }
      done()
      rootFolder.restore()
    })
    it('Check that the directory is returned if specified', function (done) {
      let rootFolder
      try {
        rootFolder = setBootstrapDirectory('testing-space')
        assert.strictEqual(rootFolder, 'testing-space')
      } catch (error) {
        console.log(error)
      }
      done()
    })
    it('Check that the workspace is returned if no directory is specified', function (done) {
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
      done()
    })
    it('Check that when directory is empty it returns true', function (done) {
      let result
      let mockEmptyDir = sinon.stub(emptyDir, 'sync').returns(true)
      result = checkDirectoryContent(__dirname)
      mockEmptyDir.restore()
      assert.strictEqual(result, true)
      done()
    })
    it('Check that when directory is not empty it returns false', function (done) {
      let result
      let mockNonEmptyDir = sinon.stub(emptyDir, 'sync').returns(false)
      result = checkDirectoryContent(__dirname)
      mockNonEmptyDir.restore()
      assert.strictEqual(result, false)
      done()
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
        let filePath
        if (value.subfolder === undefined) {
          filePath = join(testFolder, value.destination, value.filename)
        } else {
          filePath = join(testFolder, value.destination, value.subfolder, value.filename)
        }
        let result: boolean
        try {
          fs.accessSync(filePath)
          result = true
        } catch (err) {
          result = false
        }
        assert.strictEqual(result, true)
        done()
      })
    }
    it('Check that if a standard file cannot be created that it throws an error', function (done) {
      let mockFileWrite = sinon.stub(fs, 'writeFile').yields(new Error('write error'))
      assert.throws(() => writeStandardBootstrapFiles(testFolder), Error, 'write error')
      done()
      mockFileWrite.restore()
    })
    it('Check that no string is passed for reference that an error is thrown', function (done) {
      let mockGetInput = sinon.stub(vscode.window, 'showInputBox').resolves()
      getPackInfo().catch(error => {
        assert.strictEqual(error.message, 'Undefined ref')
      })
      done()
      mockGetInput.restore()
    })
    it('Check that when string contains invalid characters an error is thrown', function (done) {
      let mockGetInput = sinon.stub(vscode.window, 'showInputBox').resolves('hello there')
      getPackInfo().catch(error => {
        assert.strictEqual(error.message, 'Pack name can only contain letters, numbers and dashes. Pack will not be created correctly.')
      })
      done()
      mockGetInput.restore()
    })
    it('Check that pack information is generated correctly', async () => {
      let mockGetInput
      mockGetInput = sinon.stub(vscode.window, 'showInputBox')
      mockGetInput.onFirstCall().resolves('ref-pack')
      mockGetInput.onSecondCall().resolves('Test Author')
      mockGetInput.onThirdCall().resolves('example@example.com')
      const res = await getPackInfo()
      assert.strictEqual(res['ref'], 'ref-pack')
      assert.strictEqual(res['packname'], 'Ref Pack')
      assert.strictEqual(res['author'], 'Test Author')
      assert.strictEqual(res['email'], 'example@example.com')
      mockGetInput.restore()
    })
  })
  after('Cleanup test folder', function (done) {
    removeSync(testFolder)
    done()
  })
})

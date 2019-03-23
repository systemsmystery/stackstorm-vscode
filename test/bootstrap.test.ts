import { mkdirSync, removeSync, pathExistsSync } from 'fs-extra'
import * as fs from 'fs'
import { join } from 'path'
import { TlFolder } from '../src/enums/folders'
import { BootstrapFiles } from '../src/mappings/SubFolderMappings'
import { createFolderStructure, writeStandardBootstrapFiles, setBootstrapDirectory, checkDirectoryContent, getPackInfo, writeCustomBootstrapFiles } from '../src/bootstrap-function'
import * as assert from 'assert'
import * as sinon from 'sinon'
import * as vscode from 'vscode'
import * as emptyDir from 'empty-dir'

describe('Test VSCode Stackstorm Extension', function () {
  describe('Check bootstrap script', function () {
    describe('Check setBootstrapDirectory function', function () {
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
      it('Check that the workspace is returned if no directory is specified', async () => {
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
        return Promise.resolve()
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
      let testFolder = join(__dirname, 'test-folder-structure')
      before('Create testing folder', async () => {
        try {
          removeSync(testFolder)
        } catch {
          console.log('Folder does not exist')
        }
        mkdirSync(testFolder)
        createFolderStructure(testFolder)
        writeStandardBootstrapFiles(testFolder)
        return Promise.resolve()
      })
      after('Cleanup test folder', function (done) {
        removeSync(testFolder)
        done()
      })
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
      let testFolder = join(__dirname, 'test-standard-files')
      before('Create testing folder', async () => {
        try {
          removeSync(testFolder)
        } catch {
          console.log('Folder does not exist')
        }
        mkdirSync(testFolder)
        createFolderStructure(testFolder)
        writeStandardBootstrapFiles(testFolder)
      })
      after('Cleanup test folder', function (done) {
        removeSync(testFolder)
        done()
      })
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
        return Promise.resolve()
      })
      describe('Check that custom files write correctly', function () {
        let testFolder = join(__dirname, 'test-custom-files')
        before('Create testing folder', async () => {
          try {
            removeSync(testFolder)
          } catch {
            console.log('Folder does not exist')
          }
          mkdirSync(testFolder)
          return Promise.resolve()
        })
        before('Create files', function (done) {
          console.log(testFolder)
          let mappings = {
            'ref': 'pack-ref',
            'packname': 'Pack Ref',
            'author': 'Test Author',
            'email': 'example@example.com'
          }
          writeCustomBootstrapFiles(testFolder, mappings).catch(error => {
            console.log(error)
          })
          done()
        })
        it('Check that both templates match what they should be returning', function () {
          let README_SAMPLE = fs.readFileSync(join(__dirname, 'resources', 'README-template-match.md'), 'utf-8')
          let PACK_SAMPLE = fs.readFileSync(join(__dirname, 'resources', 'pack-template-match.yaml'), 'utf-8')
          let README_RESULT = fs.readFileSync(join(testFolder, 'README.md')).toString()
          let PACK_RESULT = fs.readFileSync(join(testFolder, 'pack.yaml'), 'utf-8')
          assert.strictEqual(README_RESULT, README_SAMPLE)
          assert.strictEqual(PACK_RESULT, PACK_SAMPLE)
        })
        it('Check that when creating top level folder an error is thrown if there is an issue', function () {
          let mockstub = sinon.stub(fs, 'mkdirSync').throws('There was an error')
          assert.throws(function () { createFolderStructure(testFolder) }, Error)
          mockstub.restore()
        })
        it('Check that when creating sub level folder an error is thrown if there is an issue', function () {
          let mockstub = sinon.stub(fs, 'mkdirSync').onCall(5).throws('There was an error at sub')
          assert.throws(function () { createFolderStructure(testFolder) }, Error)
          mockstub.restore()
        })
      })

    })
  })
})

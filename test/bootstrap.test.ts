import { mkdirSync, removeSync, pathExistsSync, ensureFileSync } from 'fs-extra'
import { readFile, accessSync, access } from 'fs'
import { join } from 'path'
import { TlFolder } from '../src/enums/folders'
import { BootstrapFiles } from '../src/mappings/SubFolderMappings'
import { bootstrapFolders, writeStandardBootstrapFiles } from '../src/bootstrap-function'
import * as assert from 'assert'

describe('Check bootstrap script', function () {
  let testFolder = join(__dirname, 'testing-space')
  before('Create bootstrap test folder', function (done) {
    mkdirSync(testFolder)
    bootstrapFolders(testFolder)
    writeStandardBootstrapFiles(testFolder)
    done()
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

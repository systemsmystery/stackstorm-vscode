import { writePackConfig, writeReadMe } from '../src/functions'
import { mkdirSync, removeSync, existsSync } from 'fs-extra'
import { join } from 'path'
import * as assert from 'assert'
import * as sinon from 'sinon'
import * as vscode from 'vscode'
import * as bootstrapfunctions from '../src/bootstrap-function'
import { TemplateFile } from '../src/enums/template'

describe('Testing writePackConfig function', function () {
  let testFolder = join(__dirname, 'writePackConfig-test')
  before('Create testing folder', async () => {
    try {
      removeSync(testFolder)
    } catch {
      console.log('Folder does not exist')
    }
    mkdirSync(testFolder)
    return Promise.resolve()
  })
  before('Create pack.yaml file', async () => {
    let mappings = {
      'ref': 'pack-ref',
      'packname': 'Pack Ref',
      'author': 'Test Author',
      'email': 'example@example.com'
    }
    let stubGetPackInfo = sinon.stub(bootstrapfunctions, 'getPackInfo').resolves(mappings)
    await writePackConfig(TemplateFile.packFile, testFolder, 'write-pack-config-pack.yaml').catch(error => {
      console.log(error)
    })
    stubGetPackInfo.restore()
    return Promise.resolve()
  })
  it('Check that file is written when writePackConfig is run', function () {
    assert.strictEqual(existsSync(join(testFolder, 'write-pack-config-pack.yaml')), true)
  })
})

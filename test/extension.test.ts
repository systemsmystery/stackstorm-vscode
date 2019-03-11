import { writeStandardTemplate, writeReadMe } from '../src/functions'
import { StandardCommandMappings } from '../src/mappings/CommandMappings'
import { readFileSync, existsSync, mkdirSync, removeSync } from 'fs-extra'
import { join } from 'path'
import { TemplateFile } from '../src/enums/template'
import * as assert from 'assert'
import * as sinon from 'sinon'
import * as vscode from 'vscode'

function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Check template files match', function () {
  let TEMPLATE_DIRECTORY = join(__dirname, '../../templateFiles/')
  let OUT_TEMPLATE_FILES = join(__dirname, '../src/templateFiles/')
  console.log(__dirname)
  for (const [key, value] of StandardCommandMappings) {
    it(`Check template file ${value.filename} matches`, function () {
      let TEMPLATE_CONTENT = readFileSync(join(TEMPLATE_DIRECTORY, value.templateFile), 'utf-8')
      let OUT_TEMPLATE_CONTENT = readFileSync(join(OUT_TEMPLATE_FILES, value.templateFile), 'utf-8')
      assert.strictEqual(OUT_TEMPLATE_CONTENT, TEMPLATE_CONTENT)
    })
  }
})

describe('Write Standard Templates to File', function () {
  let SCRATCH_DIR = join(__dirname, 'template_test_results')
  before('Create a folder to save test files', function () {
    mkdirSync(SCRATCH_DIR)
  })
  for (const [key, value] of StandardCommandMappings) {
    it(`Write Temp Files ${value.templateFile}`, function () {
      writeStandardTemplate(value.templateFile, SCRATCH_DIR, value.filename)
      let result = existsSync(join(SCRATCH_DIR, value.filename))
      assert.strictEqual(true, result)
    })
  }
  after('Remove file', function () {
    removeSync(SCRATCH_DIR)
  })
}
)

describe('Write README file', function () {
  it('Write README', function () {
    const inputStub = sinon.stub(vscode.window, 'showInputBox').resolves('My test module')
    writeReadMe(TemplateFile.ReadMe, __dirname, 'README.md').catch(error => {
      vscode.window.showErrorMessage(error)
    })
    let COMPARE_PATH = join(__dirname, 'resources', 'README.md')
    let RESULT_PATH = join(__dirname, 'README.md')

    let result = readFileSync(RESULT_PATH, 'utf-8')
    let compare = readFileSync(COMPARE_PATH, 'utf-8')

    assert.strictEqual(compare, result)
  })
})

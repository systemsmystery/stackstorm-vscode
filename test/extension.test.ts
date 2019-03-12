import { writeStandardTemplate, writeReadMe } from '../src/functions'
import { StandardCommandMappings } from '../src/mappings/CommandMappings'
import { readFileSync, existsSync, mkdirSync, removeSync } from 'fs-extra'
import { join } from 'path'
import { TemplateFile } from '../src/enums/template'
import * as assert from 'assert'
import * as sinon from 'sinon'
import * as vscode from 'vscode'

let SCRATCH_DIR = join(__dirname, 'scratch_dir')
before('Create scratch directory', function () {
  mkdirSync(SCRATCH_DIR)
})

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
  for (const [key, value] of StandardCommandMappings) {
    it(`Write Temp Files ${value.templateFile}`, function () {
      writeStandardTemplate(value.templateFile, SCRATCH_DIR, value.filename)
      let result = existsSync(join(SCRATCH_DIR, value.filename))
      assert.strictEqual(true, result)
    })
  }
}
)

describe('Write README file', function () {
  // before('Create a folder to save test files', function () {
  // })
  before('Create README file', function () {
    const inputStub = sinon.stub(vscode.window, 'showInputBox').resolves('My test module')
    writeReadMe(TemplateFile.ReadMe, SCRATCH_DIR, 'README.md-testwrite').catch(error => {
      vscode.window.showErrorMessage(error)
    })
    inputStub.reset()
  })
  it('Write README', function () {
    let COMPARE_PATH = join(__dirname, 'resources', 'README.md')
    let RESULT_PATH = join(SCRATCH_DIR, 'README.md-testwrite')

    let result = readFileSync(RESULT_PATH, 'utf-8')
    let compare = readFileSync(COMPARE_PATH, 'utf-8')

    assert.strictEqual(compare, result)
  })
  // let errorWindowSpy = sinon.spy(vscode.window, 'showErrorMessage')
  // before('Setup for no response', function () {
  //   let fakeinput = sinon.fake.returns(undefined)
  //   sinon.replace(vscode.window, 'showInputBox', fakeinput)
  // })
  it('Provide no answer for README', function () {
    const spy = sinon.spy(vscode.window, 'showErrorMessage')
    writeReadMe(TemplateFile.ReadMe, SCRATCH_DIR, 'README.md').catch(error => {
      vscode.window.showErrorMessage(error)
      let result = spy.called
      assert.strictEqual(result, true)
    })
  })
})

after('Remove file', function () {
  removeSync(SCRATCH_DIR)
})

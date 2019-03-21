import * as assert from 'assert'
import * as vscode from 'vscode'
import * as sinon from 'sinon'
import { getInput, writeFileContent, getSetting } from '../src/handlerFunctions'
import * as fs from 'fs'

describe('Test getInput handler function', function () {
  it('Test that response matches value', async function () {
    const inputStub = sinon.stub(vscode.window, 'showInputBox').resolves('My test module')
    let result: string | undefined = await getInput('Test prompt', 'Test placeholder', 'Test default value')
    assert.strictEqual(result, 'My test module')
    inputStub.restore()
  })
  it('Test that response matches undefined', async function () {
    const inputStub = sinon.stub(vscode.window, 'showInputBox').resolves()
    await getInput('Test prompt', 'Test placeholder', 'Test default value').catch(error => {
      assert.strictEqual(error.message, 'No value supplied for prompt Test prompt')
    })
    inputStub.restore()
  })
  it('Check that writeFileContent throws error', function () {
    let stubWriteFile = sinon.stub(fs, 'writeFile').yields(new Error('write error'))
    assert.throws(function () { writeFileContent('test-file.txt', 'test-content', 'test-file.txt', false) }, Error)
    stubWriteFile.restore()
  })
})

import * as assert from 'assert'
import * as vscode from 'vscode'
import * as sinon from 'sinon'
import { getInput } from '../src/handlerFunctions'

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
})

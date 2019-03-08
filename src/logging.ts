import * as vscode from 'vscode'

const OutputConsoleName = 'StackStorm'

let _outputChannel: vscode.OutputChannel

export function getOutputChannel (): vscode.OutputChannel {
  if (!_outputChannel) {
    _outputChannel = vscode.window.createOutputChannel(OutputConsoleName)
  }
  return _outputChannel
}

export function LogToConsole (logMessage: string | undefined | boolean) {
  let now = new Date()
  let date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
  let time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
  let datestamp = date + ' - ' + time
  getOutputChannel().appendLine(`${datestamp}: ${logMessage}`)
}

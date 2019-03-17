import * as vscode from 'vscode'
import { StandardCommandMappings } from './mappings/CommandMappings'
import { writeStandardTemplate, writeReadMe, writePackConfig } from './functions'
import { createFolderStructure, writeStandardBootstrapFiles, writeCustomBootstrapFiles, setBootstrapDirectory, checkDirectoryContent, getPackInfo } from './bootstrap-function'
import { Command } from './enums/command'
import { TemplateFile } from './enums/template'

export function activate (context: vscode.ExtensionContext) {
  for (const [key, value] of StandardCommandMappings) {
    let command = vscode.commands.registerCommand(key, (uri: vscode.Uri) => {
      writeStandardTemplate(value.templateFile, uri.fsPath, value.filename)
    })
    context.subscriptions.push(command)
  }

  const writeReadMeCommand = vscode.commands.registerCommand(Command.ReadMe, (uri: vscode.Uri) => {
    writeReadMe(TemplateFile.ReadMe, uri.fsPath, 'README.md').catch(error => {
      vscode.window.showErrorMessage('There was an error')
      console.log(error)
    })
  })
  context.subscriptions.push(writeReadMeCommand)

  const writePackConfigCommand = vscode.commands.registerCommand(Command.Packfile, (uri: vscode.Uri) => {
    writePackConfig(TemplateFile.packFile, uri.fsPath, 'pack.yaml').catch(error => {
      vscode.window.showErrorMessage(error)
    })
  })
  context.subscriptions.push(writePackConfigCommand)

  const bootstrapFolder = vscode.commands.registerCommand(Command.BootstrapFolder, () => {
    let projectRoot: string
    try {
      projectRoot = setBootstrapDirectory()
      if (checkDirectoryContent(projectRoot) === false) {
        vscode.window.showErrorMessage('Directory not empty')
        throw new Error('Directory not empty')
      }
      getPackInfo().then((data) => {
        createFolderStructure(projectRoot)
        writeStandardBootstrapFiles(projectRoot)
        writeCustomBootstrapFiles(projectRoot, data).catch(error => {
          if (error) {
            console.log(error)
          }
        })
      }).catch(error => {
        if (error) {
          console.log(error)
          throw new ReferenceError('Problem with pack information')
        }
      })
    } catch (error) {
      console.log(error)
      vscode.window.showErrorMessage(error)
    }
  })
  context.subscriptions.push(bootstrapFolder)
}

export function deactivate () {}

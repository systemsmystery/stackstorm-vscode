import * as vscode from 'vscode'
import { TlFolder, SubFolder } from './enums/folders'
import { SubFolderMappings, BootstrapFiles } from './mappings/SubFolderMappings'
import { TemplateFile } from './enums/template'
import { writePackConfig, writeReadMe } from './functions'
import { join } from 'path'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'

export async function bootstrapFolders () {
  const projectRoot = vscode.workspace.workspaceFolders
  if (projectRoot !== undefined) {
    for (let key in TlFolder) {
      const value = TlFolder[key]
      const folder = join(projectRoot[0].uri.fsPath, value)
      try {
        mkdirSync(folder)
        console.log(folder)
      } catch (error) {
        throw new Error(error)
      }
    }
    for (const [key, value] of SubFolderMappings) {
      const tlf = value.topLevelFolder
      const subfol = value.subFolder
      const fullPath = join(projectRoot[0].uri.fsPath, tlf, subfol)
      try {
        mkdirSync(fullPath)
      } catch (error) {
        throw new Error(error)
      }
    }
    // for files within a top level folder
    const TEMPLATE_FOLDER = 'templateFiles'
    for (const [key, value] of BootstrapFiles) {
      const fullPath = join(projectRoot[0].uri.fsPath, value.destination, value.filename)
      try {
        writeFileSync(fullPath, readFileSync(join(__dirname, TEMPLATE_FOLDER, value.templateFile), 'utf-8'), { flag: 'wx+' })
      } catch (e) {
        console.log(e)
      }
    }
    // Special case for the workflow template as it is in a subfolder
    let fullPath = join(projectRoot[0].uri.fsPath, TlFolder.Actions, SubFolder.ActionsWorkflows, 'workflow.yaml')
    try {
      writeFileSync(fullPath, readFileSync(join(__dirname, TEMPLATE_FOLDER, TemplateFile.WorkflowMetadata), 'utf-8'), { flag: 'wx+' })
    } catch (e) {
      console.log(e)
    }
    // Write Pack Config File
    await writePackConfig(TemplateFile.packFile, projectRoot[0].uri.fsPath, 'pack.yaml').catch(error => {
      vscode.window.showErrorMessage(error)
    })
    // Write README.md file
    await writeReadMe(TemplateFile.ReadMe, projectRoot[0].uri.fsPath, 'README.md').catch(error => {
      vscode.window.showErrorMessage(error)
    })
  }
}

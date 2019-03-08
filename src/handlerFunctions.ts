import * as vscode from 'vscode'
import { readFileSync, writeFileSync, lstat, truncate } from 'fs'
import { TemplateFile } from './enums/template'
import { join } from 'path'
import { LogToConsole } from './logging'
import * as lodash from 'lodash'

export function writeFileContent (destinationFile: string, fileContent: string, fileName: string, showInfoMessages: boolean) {
  try {
    writeFileSync(destinationFile, fileContent, { flag: 'wx+' })
    if (showInfoMessages === true) {
      vscode.window.showInformationMessage(`Created file ${fileName}`)
      LogToConsole(`Created file ${fileName}`)
    }
  } catch (err) {
    vscode.window.showErrorMessage(`An error occoured, see console output.`)
    LogToConsole(err)
  }
}

export async function getSettingOrInput (prompt: string, placeholder: string, setting: string, defaultValue: string) {
  let PACK_CONFIG = vscode.workspace.getConfiguration('st2')
  if (PACK_CONFIG.get(setting, '')) {
    LogToConsole(`Returning value of ${setting}`)
    let value = PACK_CONFIG.get<string>(setting)
    return value
  } else {
    LogToConsole(`Cannot find ${setting}`)
    let value = await vscode.window.showInputBox({ prompt: prompt, placeHolder: placeholder, value: defaultValue })
    return value
  }
}

export async function getInput (prompt: string, placeholder: string, defaultValue: string): Promise<string | undefined> {
  let value = await vscode.window.showInputBox({ prompt: prompt, placeHolder: placeholder, value: defaultValue })
  if (value as string) {
    return value
  } else {
    return undefined
  }
}

export function generateTemplate (templateFile: TemplateFile, mappings: object) {
  const TEMPLATE_FOLDER = 'templateFiles'
  const templatePath = join(__dirname, TEMPLATE_FOLDER, templateFile)
  lodash.templateSettings.interpolate = /{{([\s\S]+?)}}/g
  const template = lodash.template(readFileSync(templatePath, 'utf-8'))
  const content = template(mappings)
  return content
}

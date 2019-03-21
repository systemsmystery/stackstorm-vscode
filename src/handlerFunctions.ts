import * as vscode from 'vscode'
import { readFileSync, writeFileSync, lstat, truncate, writeFile } from 'fs'
import { TemplateFile } from './enums/template'
import { join, resolve } from 'path'
import { LogToConsole } from './logging'
import * as lodash from 'lodash'

export function writeFileContent (destinationFile: string, fileContent: string, fileName: string, showInfoMessages: boolean) {
  writeFile(destinationFile, fileContent, { encoding: 'utf-8', flag: 'wx+' }, (err) => {
    if (err) throw err
    if (showInfoMessages === true) {
      vscode.window.showInformationMessage(`Created file ${fileName}`)
      LogToConsole(`Created file ${fileName}`)
    }
  })
}

export function getSetting (setting: string) {
  let PACK_CONFIG = vscode.workspace.getConfiguration('st2')
  let value = PACK_CONFIG.get<string>(setting)
  if (value) {
    console.log(`Found config value ${value} for setting ${setting}`)
    return value
  }
  return
}

export async function getInput (prompt: string, placeholder: string, defaultValue: string): Promise<string> {
  const value = await vscode.window.showInputBox({ prompt: prompt, placeHolder: placeholder, value: defaultValue })
  if (value) {
    return value
  }
  throw new Error(`No value supplied for prompt ${prompt}`)
}

export function generateTemplate (templateFile: TemplateFile, mappings: object) {
  const TEMPLATE_FOLDER = 'templateFiles'
  const templatePath = join(__dirname, TEMPLATE_FOLDER, templateFile)
  lodash.templateSettings.interpolate = /{{([\s\S]+?)}}/g
  const template = lodash.template(readFileSync(templatePath, 'utf-8'))
  const content = template(mappings)
  return content
}

import * as vscode from 'vscode'
import { readFileSync } from 'fs'
import { TemplateFile } from './enums/template'
import { join } from 'path'
import { LogToConsole } from './logging'

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

export async function getInput (prompt: string, placeholder: string, defaultValue: string) {
  let value = await vscode.window.showInputBox({ prompt: prompt, placeHolder: placeholder, value: defaultValue })
  return value
}

export function getTemplate (templateFile: TemplateFile) {
  const TEMPLATE_FOLDER = 'templateFiles'
  const templatePath = join(__dirname, TEMPLATE_FOLDER, templateFile)
  const content = readFileSync(templatePath, 'utf-8')
  return readFileSync(templatePath, 'utf-8')
}

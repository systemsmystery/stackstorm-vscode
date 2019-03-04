import * as vscode from 'vscode'
import { readFileSync } from 'fs'
import { TemplateFile } from './enums/template'
import { join } from 'path'

export async function getSettingOrInput (prompt: string, placeholder: string, setting: string) {
  let PACK_CONFIG = vscode.workspace.getConfiguration('st2')
  if (PACK_CONFIG.get<string>(setting) === undefined) {
    let value = await vscode.window.showInputBox({ prompt: prompt, placeHolder: placeholder })
    return value
  }
  if (PACK_CONFIG.get<string>(setting) !== undefined) {
    let value = PACK_CONFIG.get(setting)
    return value
  }
}

export async function getInput (prompt: string, placeholder: string) {
  let value = await vscode.window.showInputBox({ prompt: prompt, placeHolder: placeholder })
  return value
}

export function getTemplate (templateFile: TemplateFile) {
  const TEMPLATE_FOLDER = 'templateFiles'
  const templatePath = join(__dirname, TEMPLATE_FOLDER, templateFile)
  const content = readFileSync(templatePath, 'utf-8')
  return readFileSync(templatePath, 'utf-8')
}

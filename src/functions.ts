import { join } from 'path'
import { writeFileSync, readFileSync, writeFile } from 'fs'
import * as vscode from 'vscode'
import * as lodash from 'lodash'
import { TemplateFile } from './enums/template'
import { getTemplate, getInput, getSettingOrInput } from './handlerFunctions'

export function writeFileContent (destinationFile: string, fileContent: string, fileName: string) {
  writeFileSync(destinationFile, fileContent, { flag: 'wx+' })
}

export function writeStandardTemplate (templateFile: TemplateFile, destination: string, filename: string) {
  const TEMPLATE_FOLDER = 'templateFiles'
  let templatePath = join(__dirname, TEMPLATE_FOLDER, templateFile)
  let content = readFileSync(templatePath, 'utf-8')
  let destinationFile = join(destination, filename)
  try {
    writeFileSync(destinationFile, content, { flag: 'wx+' })
    vscode.window.showInformationMessage(`Created file ${filename}!`)
  } catch {
    vscode.window.showErrorMessage(`Cannot create file, file with name ${filename} may already exist.`)
  }
}

export async function writeReadMe (templateFile: TemplateFile, destination: string, filename: string) {
  const templateContent = getTemplate(templateFile)
  let packname = await vscode.window.showInputBox({ prompt: 'Enter Pack Name (This will be the header of the README)', placeHolder: 'Stackstorm Integration Pack' })
  if (!packname) {
    vscode.window.showErrorMessage('Please enter a pack name')
  } else {
    const mapping = {
      name: packname
    }
    lodash.templateSettings.interpolate = /{{([\s\S]+?)}}/g
    const template = lodash.template(templateContent)
    const completedTemplate = template(mapping)
    try {
      writeFileContent(join(destination, filename), completedTemplate, filename)
    } catch {
      vscode.window.showErrorMessage('Could not write file')
    }
  }
}

export async function writePackConfig (templateFile: TemplateFile, destination: string, filename: string): Promise<boolean> {
  const templateContent = getTemplate(templateFile)
  if (!templateContent) {
    vscode.window.showErrorMessage('Cannot get content of template')
  }
  let ref = await getInput('ref input', 'ref')
  let packname = await getInput('packname input', 'packname')
  let author = await getSettingOrInput('author', 'author', 'defaultAuthor')
  let email = await getSettingOrInput('author', 'author', 'defaultEmail')
  if (!ref || !packname || !author || !email) {
    vscode.window.showErrorMessage('Please fill in all information required', 'Got it')
    throw new Error('Not all information provided')
  }
  const mappings = {
    'ref': ref,
    'name': packname,
    'author': author,
    'email': email
  }
  lodash.templateSettings.interpolate = /{{([\s\S]+?)}}/g
  const template = lodash.template(templateContent)
  const completedTemplate = template(mappings)
  try {
    writeFileContent(join(destination, filename), completedTemplate, filename)
    return true
  } catch (e) {
    return false
  }
}

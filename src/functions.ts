import { join } from 'path'
import { writeFileSync, readFileSync, writeFile, fstat, mkdirSync } from 'fs'
import * as vscode from 'vscode'
import * as lodash from 'lodash'
import { TemplateFile } from './enums/template'
import { TlFolder, SubFolder } from './enums/folders'
import { getTemplate, getInput, getSettingOrInput } from './handlerFunctions'
import { SubFolderMappings, BootstrapFiles } from './mappings/SubFolderMappings'
import { getOutputChannel, LogToConsole } from './logging'

getOutputChannel().show(true)

export function writeFileContent (destinationFile: string, fileContent: string, fileName: string) {
  writeFileSync(destinationFile, fileContent, { flag: 'wx+' })
}

export function writeStandardTemplate (templateFile: TemplateFile, destination: string, filename: string) {
  LogToConsole(`Creating ${filename} file`)
  const TEMPLATE_FOLDER = 'templateFiles'
  let templatePath = join(__dirname, TEMPLATE_FOLDER, templateFile)
  let content = readFileSync(templatePath, 'utf-8')
  let destinationFile = join(destination, filename)
  try {
    writeFileSync(destinationFile, content, { flag: 'wx+' })
    vscode.window.showInformationMessage(`Created file ${filename}!`)
    LogToConsole(`Created file ${filename}`)
  } catch (e) {
    vscode.window.showErrorMessage(`An error occoured, see console output.`)
    LogToConsole(e)
  }
}

export async function writeReadMe (templateFile: TemplateFile, destination: string, filename: string) {
  LogToConsole('Creating ReadMe file')
  const templateContent = getTemplate(templateFile)
  let packname = await vscode.window.showInputBox({ prompt: 'Enter Pack Name (This will be the header of the README)', placeHolder: 'Stackstorm Integration Pack', value: 'My First Pack' })
  if (!packname) {
    vscode.window.showErrorMessage('Please enter a pack name')
    LogToConsole('No pack name given')
  } else {
    const mapping = {
      name: packname
    }
    lodash.templateSettings.interpolate = /{{([\s\S]+?)}}/g
    const template = lodash.template(templateContent)
    const completedTemplate = template(mapping)
    try {
      writeFileContent(join(destination, filename), completedTemplate, filename)
      LogToConsole(`Created file ${filename}`)
    } catch (e) {
      vscode.window.showErrorMessage('Could not write file, check console output for error', 'Got it')
      LogToConsole(e)
    }
  }
}

export async function writePackConfig (templateFile: TemplateFile, destination: string, filename: string) {
  LogToConsole('Writing pack config file')
  const templateContent = getTemplate(templateFile)
  if (!templateContent) {
    vscode.window.showErrorMessage('Cannot get content of template')
    LogToConsole('Cannot get contents of template file')
  }
  let validChars = '^[0-9a-zA-Z-]+$'
  let ref: string | undefined = await getInput('Pack Reference (lowercase and (-) only)', 'pack-reference', 'my-first-pack')
  if (ref === undefined) {
    vscode.window.showErrorMessage('No string given', 'Got it')
    throw new Error('Undefined ref')
  } else if (!ref.match(validChars)) {
    vscode.window.showErrorMessage('Pack name can only contain letters, numbers and dashes', 'Got it')
    throw new Error('Pack name can only contain letters, numbers and dashes. Pack will not be created correctly.')
  }
  let packname = ref.replace(/-/g, ' ').toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ')
  let author = await getSettingOrInput('Pack Author', 'Pack Author', 'defaultAuthor', 'John Doe')
  let email = await getSettingOrInput('Author Email', 'Author Email', 'defaultEmail', 'john@example.com')
  if (!ref || !packname || !author || !email) {
    vscode.window.showErrorMessage('Please fill in all information required', 'Got it')
    LogToConsole('Not all information provided. Got the following:')
    LogToConsole(`ref: ${ref}`)
    LogToConsole(`packname: ${packname}`)
    LogToConsole(`author: ${author}`)
    LogToConsole(`email: ${email}`)
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
    LogToConsole(`Wrote config file to ${filename}`)
    return true
  } catch (e) {
    vscode.window.showErrorMessage('Could not create file, check output console for more details', 'Got it')
    LogToConsole(e)
    return false
  }
}

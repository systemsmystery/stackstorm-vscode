import { join } from 'path'
import { readFileSync, lstatSync } from 'fs'
import * as vscode from 'vscode'
import { TemplateFile } from './enums/template'
import { generateTemplate, getInput, getSettingOrInput, writeFileContent } from './handlerFunctions'
import { getOutputChannel, LogToConsole } from './logging'

getOutputChannel().show(true)

export function writeStandardTemplate (templateFile: TemplateFile, destination: string, filename: string) {
  LogToConsole(`Creating ${filename} file`)
  const TEMPLATE_FOLDER = 'templateFiles'
  let templatePath = join(__dirname, TEMPLATE_FOLDER, templateFile)
  let content = readFileSync(templatePath, 'utf-8')
  let destinationFile = join(destination, filename)
  writeFileContent(destinationFile, content, filename, false)
}

export async function writeReadMe (templateFile: TemplateFile, destination: string, filename: string) {
  LogToConsole('Checking if file already exists')
  LogToConsole(join(destination, filename))
  LogToConsole('Creating ReadMe file')
  let packname = await vscode.window.showInputBox({ prompt: 'Enter Pack Name (This will be the header of the README)', placeHolder: 'Stackstorm Integration Pack', value: 'My First Pack' })
  if (!packname) {
    vscode.window.showErrorMessage('Please enter a pack name')
    LogToConsole('No pack name given')
  } else {
    const mapping = {
      name: packname
    }
    let content = generateTemplate(templateFile, mapping)
    writeFileContent(join(destination, filename), content, filename, true)
  }
}

export async function writePackConfig (templateFile: TemplateFile, destination: string, filename: string) {
  LogToConsole('Writing pack config file')
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
  let content = generateTemplate(TemplateFile.packFile, mappings)
  writeFileContent(join(destination, filename), content, filename, false)

}

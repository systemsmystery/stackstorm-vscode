import { join } from 'path'
import * as fs from 'fs'
import * as vscode from 'vscode'
import { TemplateFile } from './enums/template'
import { generateTemplate, getInput, writeFileContent } from './handlerFunctions'
import { getPackInfo } from '../src/bootstrap-function'
import { getOutputChannel, LogToConsole } from './logging'
import * as util from 'util'

const writeFile = util.promisify(fs.writeFile)

getOutputChannel().show(true)

export function writeStandardTemplate (templateFile: TemplateFile, destination: string, filename: string) {
  LogToConsole(`Creating ${filename} file`)
  const TEMPLATE_FOLDER = 'templateFiles'
  let templatePath = join(__dirname, TEMPLATE_FOLDER, templateFile)
  let content = fs.readFileSync(templatePath, 'utf-8')
  let destinationFile = join(destination, filename)
  fs.writeFileSync(destinationFile, content, { flag: 'wx+' })

}

export async function writeReadMe (templateFile: TemplateFile, destination: string, filename: string) {
  LogToConsole('Checking if file already exists')
  LogToConsole(join(destination, filename))
  LogToConsole('Creating ReadMe file')
  let packname = await vscode.window.showInputBox({ prompt: 'Enter Pack Name (This will be the header of the README)',
    placeHolder: 'Stackstorm Integration Pack' })
  //   validateInput: (result: string) => {
  //     if (!result) {
  //       return 'Valid pack name required'
  //     }
  //     return null
  //   }
  // })
  if (packname === undefined) {
    throw new Error('No pack name supplied')
  } else {
    const mapping = {
      packname: packname
    }
    let content = generateTemplate(templateFile, mapping)
    fs.writeFileSync(join(destination, filename), content, { flag: 'wx+' })
  }
  return Promise.resolve()
}

export async function writePackConfig (templateFile: TemplateFile, destination: string, filename: string) {
  LogToConsole('Writing pack config file')
  const mappings = await getPackInfo()
  let content = generateTemplate(TemplateFile.packFile, mappings)
  // writeFileContent(join(destination, filename), content, filename, false)
  await writeFile(join(destination, filename), content, { encoding: 'utf8', flag: 'wx+' })
}

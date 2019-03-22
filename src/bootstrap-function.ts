import * as vscode from 'vscode'
import { TlFolder } from './enums/folders'
import { SubFolderMappings, BootstrapFiles } from './mappings/SubFolderMappings'
import { TemplateFile } from './enums/template'
import { join } from 'path'
import { mkdirSync, readFileSync, writeFile } from 'fs'
import { generateTemplate, getInput, getSetting, writeFileContent } from './handlerFunctions'
import * as emptyDir from 'empty-dir'
import { LogToConsole } from './logging'
import { IPackInfo } from './mappings/packinfoMappings'

export function setBootstrapDirectory (directory?: string) {
  if (directory) {
    return directory
  } else if (vscode.workspace.workspaceFolders !== undefined) {
    return vscode.workspace.workspaceFolders[0].uri.fsPath
  } else {
    throw new Error('No workspace open or folder specified')
  }
}

export function checkDirectoryContent (directory: string) {
  let dirResult = emptyDir.sync(directory)
  if (dirResult === true) {
    return true
  } else {
    return false
  }
}

export function createFolderStructure (directory: string) {
  for (let key in TlFolder) {
    const value = TlFolder[key]
    const folder = join(directory, value)
    try {
      mkdirSync(folder)
    } catch (error) {
      throw new Error(error)
    }
  }
  for (const [key, value] of SubFolderMappings) {
    const tlf = value.topLevelFolder
    const subfol = value.subFolder
    const fullPath = join(directory, tlf, subfol)
    try {
      mkdirSync(fullPath)
    } catch (error) {
      throw new Error(error)
    }
  }
}

export function writeStandardBootstrapFiles (directory: string) {
  const TEMPLATE_FOLDER = 'templateFiles'
  for (const [key, value] of BootstrapFiles) {
    let fullPath
    if (value.subfolder === undefined) {
      fullPath = join(directory, value.destination, value.filename)
    } else {
      fullPath = join(directory, value.destination, value.subfolder, value.filename)
    }
    writeFile(fullPath, readFileSync(join(__dirname, TEMPLATE_FOLDER, value.templateFile)), { encoding: 'utf-8', flag: 'wx+' }, (error) => {
      if (error) {
        throw error
      }
      LogToConsole(`Created file ${value.filename}`)
    })
  }
}
export async function getPackInfo (): Promise<IPackInfo> {
  let validChars = '^[0-9a-zA-Z-]+$'
  let ref
  ref = await getInput('Pack Reference (lowercase and (-) only)', 'pack-reference', 'my-first-pack')
  if (!ref.match(validChars)) {
    vscode.window.showErrorMessage('Pack name can only contain letters, numbers and dashes', 'Got it')
    return Promise.reject(new Error('Pack name can only contain letters, numbers and dashes. Pack will not be created correctly.'))
  }
  let packname = ref.replace(/-/g, ' ').toLowerCase()
  .split(' ')
  .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
  .join(' ')
  let author
  if (getSetting('defaultAuthor')) {
    author = getSetting('defaultAuthor')
  } else {
    author = await getInput('Pack Author', 'Pack Author', 'John Doe')
  }

  let email
  if (getSetting('defaultEmail')) {
    email = getSetting('defaultEmail')
  } else {
    email = await getInput('Author Email', 'Author Email', 'john@example.com')
  }

  if (!author || !email) {
    throw new Error('Pack author or email not defined')
  }

  let data: IPackInfo = {
    'ref': ref,
    'packname': packname,
    'author': author,
    'email': email
  }
  return Promise.resolve(data)
}

export async function writeCustomBootstrapFiles (directory: string, mappings: object) {
  let PackFileContent = generateTemplate(TemplateFile.packFile, mappings)
  writeFileContent(join(directory, 'pack.yaml'), PackFileContent, 'pack.yaml', true)
  let ReadMeContent = generateTemplate(TemplateFile.ReadMe, mappings)
  writeFileContent(join(directory, 'README.md'), ReadMeContent, 'README.md', true)
  return Promise.resolve()
}

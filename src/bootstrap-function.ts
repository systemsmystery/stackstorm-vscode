import * as vscode from 'vscode'
import { TlFolder, SubFolder } from './enums/folders'
import { SubFolderMappings, BootstrapFiles } from './mappings/SubFolderMappings'
import { TemplateFile } from './enums/template'
import { join } from 'path'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { generateTemplate, getInput, getSettingOrInput, writeFileContent } from './handlerFunctions'

export function setBootstrapDirectory (directory?: string) {
  if (!directory || vscode.workspace.workspaceFolders === undefined) {
    throw new Error('Please open a worksapce or set destination')
  } else if (directory) {
    return directory
  } else {
    return vscode.workspace.workspaceFolders[0].uri.fsPath
  }
}

export function bootstrapFolders (directory?: string) {
  let projectRoot = setBootstrapDirectory(directory)
  for (let key in TlFolder) {
    const value = TlFolder[key]
    const folder = join(projectRoot, value)
    try {
      mkdirSync(folder)
    } catch (error) {
      throw new Error(error)
    }
  }
  for (const [key, value] of SubFolderMappings) {
    const tlf = value.topLevelFolder
    const subfol = value.subFolder
    const fullPath = join(projectRoot, tlf, subfol)
    try {
      mkdirSync(fullPath)
    } catch (error) {
      throw new Error(error)
    }
  }
}

export function writeStandardBootstrapFiles (directory?: string) {
  const projectRoot = setBootstrapDirectory(directory)
  const TEMPLATE_FOLDER = 'templateFiles'
  for (const [key, value] of BootstrapFiles) {
    const fullPath = join(projectRoot, value.destination, value.filename)
    try {
      writeFileSync(fullPath, readFileSync(join(__dirname, TEMPLATE_FOLDER, value.templateFile), 'utf-8'), { flag: 'wx+' })
    } catch (e) {
      console.log(e)
    }
  }
  let fullPath = join(projectRoot, TlFolder.Actions, SubFolder.ActionsWorkflows, 'workflow.yaml')
  try {
    writeFileSync(fullPath, readFileSync(join(__dirname, TEMPLATE_FOLDER, TemplateFile.WorkflowMetadata), 'utf-8'), { flag: 'wx+' })
  } catch (e) {
    console.log(e)
  }
}

export async function writeCustomBootstrapFiles (directory?: string) {
  const projectRoot = setBootstrapDirectory(directory)
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
  // Write Pack Config File
  const PackMappings = {
    'ref': ref,
    'name': packname,
    'author': author,
    'email': email
  }
  let PackFileContent = generateTemplate(TemplateFile.packFile, PackMappings)
  writeFileContent(join(projectRoot, 'pack.yaml'), PackFileContent, 'pack.yaml', true)
  const ReadMeMappings = {
    name: packname
  }
  let ReadMeContent = generateTemplate(TemplateFile.ReadMe, ReadMeMappings)
  writeFileContent(join(projectRoot, 'README.md'), ReadMeContent, 'README.md', true)
}

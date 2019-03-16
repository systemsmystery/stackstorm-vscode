import { TlFolder, SubFolder, bootstrapFiles } from '../enums/folders'
import { TemplateFile } from '../enums/template'

export interface FolderLocations {
  folderType: string,
  folderLocation: string
}

export interface ISubFolder {
  topLevelFolder: TlFolder,
  subFolder: SubFolder
}

export interface IBootstrapFiles {
  templateFile: TemplateFile,
  destination: TlFolder | string,
  subfolder?: SubFolder,
  filename: bootstrapFiles
}

import { TlFolder, SubFolder, bootstrapFiles } from '../enums/folders'
import { ISubFolder, IBootstrapFiles } from '../interfaces/folderLocations'
import { TemplateFile } from '../enums/template'

export const SubFolderMappings = new Map<SubFolder, ISubFolder>([
  [SubFolder.ActionsLib, { topLevelFolder: TlFolder.Actions, subFolder: SubFolder.ActionsLib }],
  [SubFolder.ActionsWorkflows, { topLevelFolder: TlFolder.Actions, subFolder: SubFolder.ActionsWorkflows }],
  [SubFolder.SensorsCommon, { topLevelFolder: TlFolder.Sensor, subFolder: SubFolder.SensorsCommon }]
])

export const BootstrapFiles = new Map<bootstrapFiles, IBootstrapFiles>([
    [bootstrapFiles.ActionMetadataTemplate, { templateFile: TemplateFile.ActionMetadata, destination: TlFolder.Actions, filename: bootstrapFiles.ActionMetadataTemplate }],
    [bootstrapFiles.AliasTemplate, { templateFile: TemplateFile.AliasMetadata, destination: TlFolder.Aliases, filename: bootstrapFiles.AliasTemplate }],
    [bootstrapFiles.ConfigSchemaTemplate, { templateFile: TemplateFile.configSchema, destination: '', filename: bootstrapFiles.ConfigSchemaTemplate }],
    [bootstrapFiles.PolicyTemplate, { templateFile: TemplateFile.PolicyMetadata, destination: TlFolder.Policies, filename: bootstrapFiles.PolicyTemplate }],
    [bootstrapFiles.RuleTemplate, { templateFile: TemplateFile.RuleConfig, destination: TlFolder.Rules, filename: bootstrapFiles.RuleTemplate }],
    [bootstrapFiles.SensorTemplate, { templateFile: TemplateFile.SensorMetadata, destination: TlFolder.Sensor, filename: bootstrapFiles.SensorTemplate }],
    [bootstrapFiles.WorkflowTemplate, {templateFile: TemplateFile.WorkflowMetadata, destination: TlFolder.Actions, subfolder: SubFolder.ActionsWorkflows, filename: bootstrapFiles.WorkflowTemplate }]
])

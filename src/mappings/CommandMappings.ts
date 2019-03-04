import { Command } from '../enums/command'
import { IntTemplate } from '../interfaces/template'
import { TemplateFile } from '../enums/template'

export const StandardCommandMappings = new Map<Command, IntTemplate>([
    [Command.ConfigSchema, { filename: 'config.schema.yaml', templateFile: TemplateFile.configSchema }],
    [Command.ActionMetadata, { filename: 'action.yaml', templateFile: TemplateFile.ActionMetadata }],
    [Command.WorkflowMetadata, { filename: 'workflow.yaml', templateFile: TemplateFile.WorkflowMetadata }],
    [Command.RuleConfig, { filename: 'rule.yaml', templateFile: TemplateFile.RuleConfig }],
    [Command.AliasMetadata, { filename: 'alias.yaml', templateFile: TemplateFile.AliasMetadata }],
    [Command.SensorMetadata, { filename: 'sensor.yaml', templateFile: TemplateFile.SensorMetadata }],
    [Command.PolicyMetadata, { filename: 'policy.yaml', templateFile: TemplateFile.PolicyMetadata }]
])

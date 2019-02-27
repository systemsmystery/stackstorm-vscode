import { Command } from '../enums/command';
import { IntTemplate } from '../interfaces/template';
import { TemplateFile } from '../enums/template';

export const CommandMappings = new Map<Command, IntTemplate>([
    [Command.Packfile, {filename: 'pack.yaml', templateFile: TemplateFile.packFile}],
    [Command.ConfigSchema, {filename: 'config.schema.yaml', templateFile: TemplateFile.configSchema}]
]);
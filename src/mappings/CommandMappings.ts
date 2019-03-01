import { Command } from '../enums/command';
import { IntTemplate, GenTemplate } from '../interfaces/template';
import { TemplateFile } from '../enums/template';
import { genFunction } from '../enums/functions';

export const StandardCommandMappings = new Map<Command, IntTemplate>([
    //[Command.ReadMe, {filename: 'README.md', templateFile: TemplateFile.ReadMe}]
    [Command.ConfigSchema, {filename: 'config.schema.yaml', templateFile: TemplateFile.configSchema}]
]);

export const generateFileCommandMappings = new Map<Command, GenTemplate>([
    [Command.ReadMe, {filename: 'README.md', templateFile: TemplateFile.ReadMe, functionName: 'readme'}]
]);
//[Command.Packfile, {filename: 'pack.yaml', templateFile: TemplateFile.packFile}],
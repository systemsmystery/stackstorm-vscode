// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { StandardCommandMappings } from './mappings/CommandMappings';
import { writeStandardTemplate, writeReadMe, writePackConfig } from './functions';
import { Command } from './enums/command';
import { TemplateFile } from './enums/template';

export function activate(context: vscode.ExtensionContext) {
	for (const [key, value] of StandardCommandMappings) {
		let command = vscode.commands.registerCommand(key, (uri:vscode.Uri) => {
			writeStandardTemplate(value.templateFile, uri.fsPath, value.filename);
		});
		context.subscriptions.push(command);
	}

	var writeReadMeCommand = vscode.commands.registerCommand(Command.ReadMe, (uri:vscode.Uri) => {
		writeReadMe(TemplateFile.ReadMe, uri.fsPath, 'README.md');
	});
	context.subscriptions.push(writeReadMeCommand);

	var writePackConfigCommand = vscode.commands.registerCommand(Command.Packfile, (uri:vscode.Uri) => {
		writePackConfig(TemplateFile.packFile, uri.fsPath, 'pack.yaml');
	});
	context.subscriptions.push(writePackConfigCommand);
}

export function deactivate() {}

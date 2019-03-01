// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { StandardCommandMappings, generateFileCommandMappings } from './mappings/CommandMappings';
import { writeStandardTemplate, writeReadMe } from './functions';
import { cpus } from 'os';
import {Command} from './enums/command';
import { TemplateFile } from './enums/template';

export function activate(context: vscode.ExtensionContext) {
	for (const [key, value] of StandardCommandMappings) {
		let command = vscode.commands.registerCommand(key, (uri:vscode.Uri) => {
			writeStandardTemplate(value.templateFile, uri.fsPath, value.filename);
		});
		context.subscriptions.push(command);
	}

	let command = vscode.commands.registerCommand(Command.ReadMe, (uri:vscode.Uri) => {
		writeReadMe(TemplateFile.ReadMe, uri.fsPath, 'README.md');
	});
	context.subscriptions.push(command);
}

export function deactivate() {}

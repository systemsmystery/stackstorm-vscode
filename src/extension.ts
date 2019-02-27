// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CommandMappings } from './mappings/CommandMappings';
import { writeTemplateFile } from './functions';

export function activate(context: vscode.ExtensionContext) {
	for (const [key, value] of CommandMappings) {
		let command = vscode.commands.registerCommand(key, (uri:vscode.Uri) => {
			writeTemplateFile(value.templateFile, uri.fsPath, value.filename);
		});
		context.subscriptions.push(command);
	}
}

export function deactivate() {}

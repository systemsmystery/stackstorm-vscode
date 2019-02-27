import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { TemplateFile } from './enums/template';

export function writeTemplateFile(templateFile: TemplateFile, destination: string, filename: string){
    const templates_folder = 'templateFiles';
    let templatePath = path.join(__dirname, templates_folder, templateFile);
    let content = fs.readFileSync(templatePath, 'utf-8');
    let destinationFile = path.join(destination, filename);
    try{
        fs.writeFileSync(destinationFile, content, { flag: 'wx+' });
        vscode.window.showInformationMessage(`Created file ${filename}!`);
    } catch {
        vscode.window.showErrorMessage(`Cannot create file, file with name ${filename} may already exist.`);
    }
}
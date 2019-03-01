import { join } from 'path';
import { writeFileSync, readFileSync } from 'fs';
import * as vscode from 'vscode';
import * as lodash from 'lodash';
import { TemplateFile } from './enums/template';

export function writeFile(destinationFile: string, fileContent: string, fileName: string){
    try{
        writeFileSync(destinationFile, fileContent, { flag: 'wx+' });
        vscode.window.showInformationMessage(`Created file ${fileName}!`);
    } catch(err) {
        vscode.window.showErrorMessage(`Cannot create file, file with name ${fileName} may already exist.`);
        console.log(err);
    }
}

export function getTemplate(templateFile: TemplateFile){
    const templates_folder = 'templateFiles';
    const templatePath = join(__dirname, templates_folder, templateFile);
    const content = readFileSync(templatePath, 'utf-8');
    return readFileSync(templatePath, 'utf-8');
}

export function writeStandardTemplate(templateFile: TemplateFile, destination: string, filename: string){
    const templates_folder = 'templateFiles';
    let templatePath = join(__dirname, templates_folder, templateFile);
    let content = readFileSync(templatePath, 'utf-8');
    let destinationFile = join(destination, filename);
    try{
        writeFileSync(destinationFile, content, { flag: 'wx+' });
        vscode.window.showInformationMessage(`Created file ${filename}!`);
    } catch {
        vscode.window.showErrorMessage(`Cannot create file, file with name ${filename} may already exist.`);
    }
}

export async function writeReadMe(templateFile: TemplateFile, destination: string, filename: string){
    console.log('render template');
    const templateContent = getTemplate(templateFile);
    let packname = await vscode.window.showInputBox({prompt: 'Enter Pack Name (This will be the header of the README', placeHolder: 'Stackstorm Integration Pack'});
    if (!packname){
        vscode.window.showErrorMessage('Please enter a pack name');
    } else {
        const mapping = {
            name: packname
        };
        lodash.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
        const template = lodash.template(templateContent);
        const completedTemplate = template(mapping);
        writeFile(join(destination, filename), completedTemplate, filename);
    }
}
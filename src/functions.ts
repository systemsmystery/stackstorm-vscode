import { join } from 'path'
import { writeFileSync, readFileSync } from 'fs'
import * as vscode from 'vscode'
import * as lodash from 'lodash'
import { TemplateFile } from './enums/template'

export function writeFile (destinationFile: string, fileContent: string, fileName: string) {
  try {
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
    const templateContent = getTemplate(templateFile);
    let packname = await vscode.window.showInputBox({prompt: 'Enter Pack Name (This will be the header of the README)', placeHolder: 'Stackstorm Integration Pack'});
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

export async function writePackConfig(templateFile: TemplateFile, destination: string, filename: string){
    const templateContent = getTemplate(templateFile);
    let ref = await vscode.window.showInputBox({prompt: 'Enter Pack reference.', placeHolder: 'my-first-stackstorm-pack'});
    let name = await vscode.window.showInputBox({prompt: 'Enter Pack Name', placeHolder: 'Stackstorm Integration Pack'});
    console.log(vscode.workspace.getConfiguration().get('st2.defaultAuthor'));
    const author = (vscode.workspace.getConfiguration().get('st2.defaultAuthor'))?
        vscode.workspace.getConfiguration().get('st2.defaultAuthor') :
        await vscode.window.showInputBox({prompt: 'Enter Author Name', placeHolder: 'John Doe'});
    const email = (vscode.workspace.getConfiguration().get('st2.defaultemail'))?
        vscode.workspace.getConfiguration().get('st2.defaultemail') :
        await vscode.window.showInputBox({prompt: 'Enter Author Name', placeHolder: 'John Doe'});
    if (!ref || !name || !author || !email){
        vscode.window.showErrorMessage('Please fill in all information');
    } else {
        const mapping = {
            ref: ref,
            name: name,
            author: author,
            email: email
        };
        lodash.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
        const template = lodash.template(templateContent);
        const completedTemplate = template(mapping);
        writeFile(join(destination, filename), completedTemplate, filename);
    }
}
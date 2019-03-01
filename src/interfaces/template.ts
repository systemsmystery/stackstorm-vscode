import { TemplateFile } from '../enums/template';

export interface IntTemplate {
    filename: string;
    templateFile: TemplateFile;
}

export interface GenTemplate {
    filename: string;
    templateFile: TemplateFile;
    functionName: string;
}
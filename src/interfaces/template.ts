import { TemplateFile } from '../enums/template';
import { genFunction } from '../enums/functions';

export interface IntTemplate {
    filename: string;
    templateFile: TemplateFile;
}

export interface GenTemplate {
    filename: string;
    templateFile: TemplateFile;
    functionName: string;
}
import * as assert from 'assert';
import { getTemplate, writeReadMe } from '../functions';
import { StandardCommandMappings } from '../mappings/CommandMappings';
import { fstat } from 'fs';
import * as fs from 'fs';
import * as vscode from 'vscode';
import {join} from 'path';
import { Command } from '../enums/command';

suite("Content of Templates Match", function () {

    for (const [key, value] of StandardCommandMappings) {
        const templateFile = value.templateFile;
    test(`Get content of ${templateFile}`, function () {
        const testfile = join(__dirname, '../../templateFiles/', templateFile);
        const content = fs.readFileSync(testfile, 'utf-8');
        assert.strictEqual(content, getTemplate(value.templateFile));
    });
}});

// describe('Get content of template', () => {
//     it('should return the content of the README template', () => {
//         const result = getTemplate(TemplateFile.ReadMe);
//         expect(result).to.contain('[Short description of what the pack does]');
//     });
// });
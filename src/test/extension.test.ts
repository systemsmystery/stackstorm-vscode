import * as assert from 'assert';
import { getTemplate, writeReadMe } from '../functions';
import { TemplateFile } from '../enums/template';
import { fstat } from 'fs';
import * as fs from 'fs';
import * as vscode from 'vscode';
import {join} from 'path';

suite("Extension Tests", function () {

    test("Read Me File", function () {
        const testfile = join(__dirname, '../../templateFiles/README.md.tmpl');
        const content = fs.readFileSync(testfile, 'utf-8');
        assert.strictEqual(content, getTemplate(TemplateFile.ReadMe));
    });

});

// describe('Get content of template', () => {
//     it('should return the content of the README template', () => {
//         const result = getTemplate(TemplateFile.ReadMe);
//         expect(result).to.contain('[Short description of what the pack does]');
//     });
// });
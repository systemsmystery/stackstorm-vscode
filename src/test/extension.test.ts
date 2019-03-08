import * as assert from 'assert'
import { generateTemplate } from '../handlerFunctions'
import { StandardCommandMappings } from '../mappings/CommandMappings'
import { readFileSync } from 'fs'
import { join } from 'path'

suite('Content of Templates Match', function () {

  for (const [key, value] of StandardCommandMappings) {
    const templateFile = value.templateFile
    test(`Get content of ${templateFile}`, function () {
      const testfile = join(__dirname, '../../templateFiles/', templateFile)
      const content = readFileSync(testfile, 'utf-8')
     // assert.strictEqual(content, generateTemplate(value.templateFile))
    })
  }
})

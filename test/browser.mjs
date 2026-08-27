import assert from 'node:assert/strict'
import vm from 'node:vm'
import { build } from 'esbuild'

const buildResult = await build({
  bundle: true,
  entryPoints: [new URL('../index.mjs', import.meta.url).pathname],
  format: 'iife',
  globalName: 'StacklineUpdateSection',
  platform: 'browser',
  write: false
})

const source = buildResult.outputFiles[0].text
assert.equal(/require\(["'](?:node:)?[^"']+["']\)/.test(source), false)

const context = {}
vm.runInNewContext(source, context)

const updateSection = context.StacklineUpdateSection.default
const parse = context.StacklineUpdateSection.parse
const starts = (line) => line === 'START'
const ends = (line) => line === 'END'

assert.equal(
  updateSection('before\nSTART\nold\nEND\nafter', 'START\nnew\nEND', starts, ends),
  'before\nSTART\nnew\nEND\nafter'
)
assert.deepEqual(
  JSON.parse(JSON.stringify(parse(['START', 'body'], starts, ends))),
  { hasStart: true, hasEnd: false, startIdx: 0, endIdx: 1 }
)

console.log('Browser bundle executed without Node.js built-ins or polyfills.')

'use strict'

var assert = require('assert')
var manifest = require('../package.json')
var direct = require('..')
var index = require('../index.js')
var historical = require('../update-section.js')

function starts (line) {
  return line === 'START'
}

function ends (line) {
  return line === 'END'
}

assert.strictEqual(manifest.name, '@stackline/update-section')
assert.strictEqual(manifest.dependencies, undefined)
assert.strictEqual(manifest.optionalDependencies, undefined)
assert.strictEqual(manifest.peerDependencies, undefined)
assert.strictEqual(direct, index)
assert.strictEqual(direct, historical)
assert.deepStrictEqual(Object.keys(direct), ['parse'])
assert.strictEqual(
  direct('before\nSTART\nold\nEND\nafter', 'START\nnew\nEND', starts, ends),
  'before\nSTART\nnew\nEND\nafter'
)
assert.deepStrictEqual(direct.parse(['before', 'START', 'body'], starts, ends), {
  hasStart: true,
  hasEnd: false,
  startIdx: 1,
  endIdx: 2
})

console.log('Runtime compatibility checks passed on Node ' + process.version + '.')

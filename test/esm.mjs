import assertModule from 'assert'
import updateSection, { parse, updateSection as named } from '../index.mjs'
import historical from '../update-section.js'

const assert = assertModule.strict

const starts = (line) => line === 'START'
const ends = (line) => line === 'END'

assert.equal(updateSection, named)
assert.equal(updateSection, historical)
assert.equal(parse, updateSection.parse)
assert.equal(
  updateSection('START\nold\nEND', 'START\nnew\nEND', starts, ends),
  'START\nnew\nEND'
)
assert.deepEqual(parse(['START', 'body'], starts, ends), {
  hasStart: true,
  hasEnd: false,
  startIdx: 0,
  endIdx: 1
})

console.log('ESM default, named, parse, and CommonJS historical-entry checks passed.')

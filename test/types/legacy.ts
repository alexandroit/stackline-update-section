import updateSection = require('../..')
import historical = require('../../update-section')

const starts: updateSection.LineMatcher = (line) => line === 'START'
const ends: updateSection.LineMatcher = (line) => line === 'END'
const output: string = updateSection(
  'START\nold\nEND',
  'START\nnew\nEND',
  starts,
  ends,
  false
)
const info: updateSection.ParseResult = updateSection.parse(output.split('\n'), starts, ends)
const historicalOutput: string = historical('plain', 'section', starts, ends)

info.hasEnd.valueOf()
info.endIdx.toFixed()
historicalOutput.toUpperCase()

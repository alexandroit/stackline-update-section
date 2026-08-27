import updateSection = require('@stackline/update-section')

const starts: updateSection.LineMatcher = (line) => line === 'START'
const ends: updateSection.LineMatcher = (line) => line === 'END'
const output = updateSection('plain', 'START\nnew\nEND', starts, ends)
const info = updateSection.parse(output.split('\n'), starts, ends)

info.startIdx.toFixed()

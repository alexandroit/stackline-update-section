import updateSection, { parse } from '../index.mjs'

const starts = (line) => line === 'BEGIN'
const ends = (line) => line === 'END'
const updated = updateSection('title\nBEGIN\nold\nEND', 'BEGIN\nnew\nEND', starts, ends)
const location = parse(updated.split('\n'), starts, ends)

if (!location.hasEnd || location.startIdx !== 1 || location.endIdx !== 3) {
  throw new Error('section metadata was not preserved')
}

console.log(updated)

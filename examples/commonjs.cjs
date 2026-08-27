'use strict'

const updateSection = require('..')

const content = ['# Project', '<!-- START -->', 'old', '<!-- END -->'].join('\n')
const section = ['<!-- START -->', 'current', '<!-- END -->'].join('\n')
const updated = updateSection(
  content,
  section,
  (line) => line === '<!-- START -->',
  (line) => line === '<!-- END -->'
)

if (!updated.includes('current')) throw new Error('section was not updated')
console.log(updated)

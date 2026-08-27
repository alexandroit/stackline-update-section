'use strict'

var assert = require('node:assert/strict')
var baseline = require('update-section-baseline')
var maintained = require('..')

var state = 0x51a7c0de

function random () {
  state = (state * 1664525 + 1013904223) >>> 0
  return state / 0x100000000
}

function makeBody (prefix, count) {
  var lines = []
  for (var index = 0; index < count; index += 1) {
    lines.push(prefix + '-' + index + '-' + Math.floor(random() * 1000000))
  }
  return lines
}

for (var caseIndex = 0; caseIndex < 2000; caseIndex += 1) {
  var newline = random() < 0.25 ? '\r\n' : '\n'
  var start = 'START-' + caseIndex
  var end = 'END-' + caseIndex
  var prefix = makeBody('prefix', Math.floor(random() * 8))
  var oldBody = makeBody('old', Math.floor(random() * 12))
  var suffix = makeBody('suffix', Math.floor(random() * 8))
  var newBody = makeBody('new', Math.floor(random() * 15))
  var section = [start].concat(newBody, [end]).join(newline)
  var mode = caseIndex % 3
  var contentLines
  var top = random() < 0.5

  if (mode === 0) contentLines = prefix.concat([start], oldBody, [end], suffix)
  else if (mode === 1) contentLines = prefix.concat([start], oldBody)
  else contentLines = prefix.concat(oldBody, suffix)

  var content = contentLines.join(newline)
  var matchesStart = function (line) { return line.replace(/\r$/, '') === start }
  var matchesEnd = function (line) { return line.replace(/\r$/, '') === end }

  assert.equal(
    maintained(content, section, matchesStart, matchesEnd, top),
    baseline(content, section, matchesStart, matchesEnd, top),
    'ordinary differential case ' + caseIndex
  )
}

for (const content of ['', null, undefined, false, 0, NaN]) {
  assert.strictEqual(
    maintained(content, 'section', null, null),
    baseline(content, 'section', null, null)
  )
}

console.log('2,000 ordinary and six falsey cases matched update-section@0.3.3.')

'use strict'

var assert = require('node:assert/strict')
var test = require('node:test')
var updateSection = require('..')

test('replaces inside a 200,000-line input and stops scanning at the chosen end', function () {
  var lines = new Array(200000)
  for (var index = 0; index < lines.length; index += 1) lines[index] = 'line-' + index
  lines[100000] = 'START'
  lines[100001] = 'old'
  lines[100002] = 'END'

  var startCalls = 0
  var endCalls = 0
  var output = updateSection(
    lines.join('\n'),
    'START\nnew\nEND',
    function (line) {
      startCalls += 1
      return line === 'START'
    },
    function (line) {
      endCalls += 1
      return line === 'END'
    }
  ).split('\n')

  assert.equal(output.length, lines.length)
  assert.deepEqual(output.slice(99999, 100004), [
    'line-99999',
    'START',
    'new',
    'END',
    'line-100003'
  ])
  assert.equal(startCalls, 100001)
  assert.equal(endCalls, 100002)
})

test('accepts a replacement section containing more than 100,000 lines', function () {
  var sectionLines = new Array(120003)
  sectionLines[0] = 'START'
  for (var index = 1; index < sectionLines.length - 1; index += 1) {
    sectionLines[index] = 'generated-' + index
  }
  sectionLines[sectionLines.length - 1] = 'END'

  var result = updateSection(
    'before\nSTART\nold\nEND\nafter',
    sectionLines.join('\n'),
    function (line) { return line === 'START' },
    function (line) { return line === 'END' }
  ).split('\n')

  assert.equal(result.length, sectionLines.length + 2)
  assert.equal(result[0], 'before')
  assert.equal(result[1], 'START')
  assert.equal(result[120002], 'generated-120001')
  assert.equal(result[120003], 'END')
  assert.equal(result[120004], 'after')
})

test('handles a large missing-end input through its inclusive final boundary', function () {
  var lines = ['before', 'START']
  for (var index = 0; index < 150000; index += 1) lines.push('stale-' + index)

  var result = updateSection(
    lines.join('\n'),
    'START\nnew\nEND',
    function (line) { return line === 'START' },
    function (line) { return line === 'END' }
  )

  assert.equal(result, 'before\nSTART\nnew\nEND')
})

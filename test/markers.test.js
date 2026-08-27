'use strict'

var assert = require('node:assert/strict')
var test = require('node:test')
var updateSection = require('..')

var replacement = ['START', 'new', 'END'].join('\n')

function starts (line) {
  return line === 'START'
}

function ends (line) {
  return line === 'END'
}

test('ignores crossed end markers and selects the first end after the start', function () {
  var content = ['before', 'END', 'gap', 'START', 'old', 'END', 'after'].join('\n')
  assert.equal(
    updateSection(content, replacement, starts, ends),
    ['before', 'END', 'gap', 'START', 'new', 'END', 'after'].join('\n')
  )
})

test('a crossed end without a later end replaces from the start through EOF', function () {
  var content = ['before', 'END', 'gap', 'START', 'old', 'tail'].join('\n')
  assert.equal(
    updateSection(content, replacement, starts, ends),
    ['before', 'END', 'gap', 'START', 'new', 'END'].join('\n')
  )
})

test('uses the first start and first subsequent end when starts are duplicated', function () {
  var content = [
    'before',
    'START',
    'outer',
    'START',
    'inner',
    'END',
    'between',
    'END',
    'after'
  ].join('\n')

  assert.equal(
    updateSection(content, replacement, starts, ends),
    ['before', 'START', 'new', 'END', 'between', 'END', 'after'].join('\n')
  )
})

test('preserves every duplicate end before the selected start', function () {
  var content = ['END', 'prelude', 'END', 'before', 'START', 'old', 'END', 'after'].join('\n')
  assert.equal(
    updateSection(content, replacement, starts, ends),
    ['END', 'prelude', 'END', 'before', 'START', 'new', 'END', 'after'].join('\n')
  )
})

test('a line matching both callbacks becomes a start before it can become an end', function () {
  var matches = function (line) { return line === 'MARK' }
  var info = updateSection.parse(['before', 'MARK', 'body', 'MARK', 'after'], matches, matches)
  assert.deepEqual(info, {
    hasStart: true,
    hasEnd: true,
    startIdx: 1,
    endIdx: 3
  })
})

test('missing start uses the exact historical two-LF separators', function () {
  assert.equal(
    updateSection('content', replacement, starts, ends),
    'content\n\n' + replacement
  )
  assert.equal(
    updateSection('content', replacement, starts, ends, true),
    replacement + '\n\ncontent'
  )
})

test('missing end replaces the selected start through the final line', function () {
  assert.equal(
    updateSection('before\nSTART\nold\ntail', replacement, starts, ends),
    'before\n' + replacement
  )
})

test('LF splitting preserves CR characters for callbacks and output', function () {
  var seen = []
  var content = 'before\r\nSTART\r\nold\r\nEND\r\nafter'
  var section = 'START\r\nnew\r\nEND'
  var result = updateSection(
    content,
    section,
    function (line) {
      seen.push(line)
      return line === 'START\r'
    },
    function (line) {
      seen.push(line)
      return line === 'END\r'
    }
  )

  assert.equal(result, 'before\r\nSTART\r\nnew\r\nEND\nafter')
  assert.equal(seen.includes('START\r'), true)
  assert.equal(seen.includes('END\r'), true)
})

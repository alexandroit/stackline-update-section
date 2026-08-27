'use strict'

var assert = require('node:assert/strict')
var test = require('node:test')
var updateSection = require('..')

function starts (line) {
  return line === 'START'
}

function ends (line) {
  return line === 'END'
}

test('issue #1: missing-end endIdx is the inclusive final line', function () {
  assert.deepEqual(updateSection.parse(['before', 'START', 'body'], starts, ends), {
    hasStart: true,
    hasEnd: false,
    startIdx: 1,
    endIdx: 2
  })
})

test('issue #2: hasEnd reports whether the callback actually matched', function () {
  assert.deepEqual(updateSection.parse(['before', 'START', 'body', 'tail'], starts, ends), {
    hasStart: true,
    hasEnd: false,
    startIdx: 1,
    endIdx: 3
  })
})

test('found-end metadata remains inclusive', function () {
  assert.deepEqual(updateSection.parse(['before', 'START', 'body', 'END', 'after'], starts, ends), {
    hasStart: true,
    hasEnd: true,
    startIdx: 1,
    endIdx: 3
  })
})

test('no-start metadata keeps sentinel start and inclusive final boundary', function () {
  assert.deepEqual(updateSection.parse(['before', 'after'], starts, ends), {
    hasStart: false,
    hasEnd: false,
    startIdx: -1,
    endIdx: 1
  })
  assert.deepEqual(updateSection.parse([], starts, ends), {
    hasStart: false,
    hasEnd: false,
    startIdx: -1,
    endIdx: -1
  })
})

test('active-consumer pattern reads content after a complete generated section', function () {
  var lines = ['heading', 'START', 'generated', 'END', 'first kept', 'second kept']
  var info = updateSection.parse(lines, starts, ends)
  var contentAfterSection = info.hasEnd ? lines.slice(info.endIdx + 1) : []

  assert.deepEqual(contentAfterSection, ['first kept', 'second kept'])
})

test('active-consumer pattern does not claim content follows a missing end', function () {
  var lines = ['heading', 'START', 'generated', 'still generated']
  var info = updateSection.parse(lines, starts, ends)

  assert.equal(info.hasEnd, false)
  assert.equal(info.endIdx, lines.length - 1)
})

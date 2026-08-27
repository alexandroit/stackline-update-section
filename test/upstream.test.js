'use strict'

var assert = require('node:assert/strict')
var test = require('node:test')
var updateSection = require('..')

var update = [
  'START -- GENERATED GOODNESS',
  'this was painstakingly re-generated',
  'and we added another line',
  'here',
  'END -- GENERATED GOODNESS'
].join('\n')

function matchesStart (line) {
  return /START -- GENERATED GOODNESS/.test(line)
}

function matchesEnd (line) {
  return /END -- GENERATED GOODNESS/.test(line)
}

test('replaces a complete upstream section', function () {
  var original = [
    '# Some Project',
    '',
    'Does a bunch of things',
    '',
    'START -- GENERATED GOODNESS',
    'this was painstakingly generated',
    'as was this',
    'END -- GENERATED GOODNESS',
    '',
    '#The End',
    '',
    'Til next time'
  ].join('\n')

  assert.deepEqual(updateSection(original, update, matchesStart, matchesEnd).split('\n'), [
    '# Some Project',
    '',
    'Does a bunch of things',
    '',
    'START -- GENERATED GOODNESS',
    'this was painstakingly re-generated',
    'and we added another line',
    'here',
    'END -- GENERATED GOODNESS',
    '',
    '#The End',
    '',
    'Til next time'
  ])
})

test('replaces from a start marker through EOF when the end is missing', function () {
  var original = [
    '# Some Project',
    '',
    'Does a bunch of things',
    '',
    'START -- GENERATED GOODNESS',
    'this was painstakingly generated',
    'as was this',
    '',
    '#The End',
    '',
    'Til next time'
  ].join('\n')

  assert.deepEqual(updateSection(original, update, matchesStart, matchesEnd).split('\n'), [
    '# Some Project',
    '',
    'Does a bunch of things',
    '',
    'START -- GENERATED GOODNESS',
    'this was painstakingly re-generated',
    'and we added another line',
    'here',
    'END -- GENERATED GOODNESS'
  ])
})

test('appends when only an end marker exists', function () {
  var original = [
    '# Some Project',
    '',
    'Does a bunch of things',
    '',
    'this was painstakingly generated',
    'as was this',
    '',
    'END -- GENERATED GOODNESS',
    '#The End',
    '',
    'Til next time'
  ].join('\n')

  assert.deepEqual(updateSection(original, update, matchesStart, matchesEnd).split('\n'), [
    '# Some Project',
    '',
    'Does a bunch of things',
    '',
    'this was painstakingly generated',
    'as was this',
    '',
    'END -- GENERATED GOODNESS',
    '#The End',
    '',
    'Til next time',
    '',
    'START -- GENERATED GOODNESS',
    'this was painstakingly re-generated',
    'and we added another line',
    'here',
    'END -- GENERATED GOODNESS'
  ])
})

test('appends when neither marker exists', function () {
  var original = [
    '# Some Project',
    '',
    'Does a bunch of things',
    '',
    '#The End',
    '',
    'Til next time'
  ].join('\n')

  assert.deepEqual(updateSection(original, update, matchesStart, matchesEnd).split('\n'), [
    '# Some Project',
    '',
    'Does a bunch of things',
    '',
    '#The End',
    '',
    'Til next time',
    '',
    'START -- GENERATED GOODNESS',
    'this was painstakingly re-generated',
    'and we added another line',
    'here',
    'END -- GENERATED GOODNESS'
  ])
})

test('prepends when neither marker exists and top is true', function () {
  var original = [
    '# Some Project',
    '',
    'Does a bunch of things',
    '',
    '#The End',
    '',
    'Til next time'
  ].join('\n')

  assert.deepEqual(updateSection(original, update, matchesStart, matchesEnd, true).split('\n'), [
    'START -- GENERATED GOODNESS',
    'this was painstakingly re-generated',
    'and we added another line',
    'here',
    'END -- GENERATED GOODNESS',
    '',
    '# Some Project',
    '',
    'Does a bunch of things',
    '',
    '#The End',
    '',
    'Til next time'
  ])
})

test('returns only the section for an empty string', function () {
  assert.equal(updateSection('', update, matchesStart, matchesEnd), update)
})

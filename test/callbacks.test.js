'use strict'

var assert = require('node:assert/strict')
var test = require('node:test')
var updateSection = require('..')

test('preserves callback order, one-argument calls, line values, and strict receivers', function () {
  var calls = []

  function matchesStart (line) {
    calls.push(['start', line, arguments.length, this])
    return line === 'START\r'
  }

  function matchesEnd (line) {
    calls.push(['end', line, arguments.length, this])
    return line === 'END\r'
  }

  var info = updateSection.parse(
    ['pre\r', 'START\r', 'body\r', 'END\r', 'after\r'],
    matchesStart,
    matchesEnd
  )

  assert.deepEqual(info, {
    hasStart: true,
    hasEnd: true,
    startIdx: 1,
    endIdx: 3
  })
  assert.deepEqual(calls.map(function (call) { return call.slice(0, 3) }), [
    ['start', 'pre\r', 1],
    ['end', 'pre\r', 1],
    ['start', 'START\r', 1],
    ['end', 'body\r', 1],
    ['end', 'END\r', 1]
  ])
  calls.forEach(function (call) { assert.equal(call[3], undefined) })
})

test('stops invoking callbacks after the first complete section', function () {
  var seen = []
  updateSection.parse(
    ['START', 'END', 'START', 'END'],
    function (line) {
      seen.push('start:' + line)
      return line === 'START'
    },
    function (line) {
      seen.push('end:' + line)
      return line === 'END'
    }
  )

  assert.deepEqual(seen, ['start:START', 'end:END'])
})

test('uses callback truthiness without coercing return values first', function () {
  assert.deepEqual(updateSection.parse(
    ['first', 'second'],
    function () { return { matched: true } },
    function () { return 'matched' }
  ), {
    hasStart: true,
    hasEnd: true,
    startIdx: 0,
    endIdx: 1
  })
})

test('returns synchronously and propagates the exact start callback error', function () {
  var sentinel = new Error('start sentinel')
  var returned = updateSection(
    'START\nold\nEND',
    'START\nnew\nEND',
    function (line) { return line === 'START' },
    function (line) { return line === 'END' }
  )
  assert.equal(typeof returned, 'string')

  try {
    updateSection.parse(['line'], function () { throw sentinel }, function () { return false })
    assert.fail('expected callback to throw')
  } catch (error) {
    assert.strictEqual(error, sentinel)
  }
})

test('propagates the exact end callback error before and after a start', function () {
  var before = new Error('before start')
  var after = new Error('after start')

  assert.throws(function () {
    updateSection.parse(
      ['prelude'],
      function () { return false },
      function () { throw before }
    )
  }, function (error) { return error === before })

  assert.throws(function () {
    updateSection.parse(
      ['START', 'body'],
      function (line) { return line === 'START' },
      function () { throw after }
    )
  }, function (error) { return error === after })
})

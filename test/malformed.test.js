'use strict'

var assert = require('node:assert/strict')
var test = require('node:test')
var updateSection = require('..')

function never () {
  return false
}

test('falsey content short-circuits before callbacks and returns section by identity', function () {
  var section = { intentionally: 'not a string' }
  var values = ['', null, undefined, false, 0, NaN]

  values.forEach(function (content) {
    assert.strictEqual(updateSection(content, section, null, null), section)
  })
})

test('truthy content without a split method throws synchronously', function () {
  [true, 1, {}, [], Symbol('content')].forEach(function (content) {
    assert.throws(function () {
      updateSection(content, 'section', never, never)
    }, TypeError)
  })
})

test('non-callable matchers retain synchronous TypeErrors', function () {
  assert.throws(function () {
    updateSection('content', 'section', null, never)
  }, TypeError)
  assert.throws(function () {
    updateSection('content', 'section', never, undefined)
  }, TypeError)
  assert.throws(function () {
    updateSection.parse(['content'], null, never)
  }, TypeError)
})

test('malformed sections stringify only on the missing-start append and prepend paths', function () {
  assert.equal(updateSection('plain', null, never, never), 'plain\n\nnull')
  assert.equal(updateSection('plain', null, never, never, true), 'null\n\nplain')
  assert.equal(updateSection('plain', false, never, never), 'plain\n\nfalse')

  assert.throws(function () {
    updateSection('START\nold', null, function (line) { return line === 'START' }, never)
  }, TypeError)
})

test('parse retains array-like behavior and reports an empty boundary', function () {
  assert.deepEqual(updateSection.parse([], null, null), {
    hasStart: false,
    hasEnd: false,
    startIdx: -1,
    endIdx: -1
  })

  assert.throws(function () {
    updateSection.parse(null, never, never)
  }, TypeError)

  var seen
  var info = updateSection.parse({ 0: undefined, length: 1 }, function (line) {
    seen = line
    return false
  }, never)
  assert.equal(seen, undefined)
  assert.equal(info.endIdx, 0)
})

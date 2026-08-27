import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const registryArgument = process.argv.find((value) => value.startsWith('--registry='))
const registry = registryArgument
  ? registryArgument.slice('--registry='.length)
  : process.env.STACKLINE_REGISTRY || 'http://127.0.0.1:4873'
const version = process.env.STACKLINE_VERSION || '1.0.0'
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-update-section-registry-'))

try {
  await writeFile(path.join(temporary, 'package.json'), JSON.stringify({
    private: true,
    dependencies: {
      '@stackline/update-section': version,
      'update-section': `npm:@stackline/update-section@${version}`
    }
  }))

  const installed = spawnSync('npm', [
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    '--registry',
    registry
  ], {
    cwd: temporary,
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024
  })
  assert.equal(installed.status, 0, installed.stdout + installed.stderr)

  const checked = spawnSync(process.execPath, ['--input-type=commonjs', '-e', [
    "const direct = require('@stackline/update-section')",
    "const alias = require('update-section')",
    "const historical = require('@stackline/update-section/update-section.js')",
    "const starts = (line) => line === 'START'",
    "const ends = (line) => line === 'END'",
    "const input = 'START\\nold\\nEND'",
    "const section = 'START\\nnew\\nEND'",
    "if (direct !== historical || direct(input, section, starts, ends) !== alias(input, section, starts, ends)) process.exit(1)"
  ].join(';')], {
    cwd: temporary,
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024
  })
  assert.equal(checked.status, 0, checked.stdout + checked.stderr)
} finally {
  await rm(temporary, { force: true, recursive: true })
}

console.log(`Registry direct, legacy-alias, and historical-deep checks passed against ${registry}.`)

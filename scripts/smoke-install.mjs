import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import os from 'node:os'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-update-section-pack-'))
let tarball

function run (command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || temporary,
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024
  })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  return result
}

try {
  const packed = run('npm', ['pack', '--json', '--ignore-scripts'], { cwd: root })
  const packResult = JSON.parse(packed.stdout)[0]
  tarball = path.join(root, packResult.filename)

  const paths = packResult.files.map((file) => file.path)
  for (const required of [
    'CHANGELOG.md',
    'LICENSE',
    'NOTICE',
    'README.md',
    'SECURITY.md',
    'THIRD_PARTY_LICENSES.md',
    'index.js',
    'index.mjs',
    'index.d.ts',
    'index.d.cts',
    'index.d.mts',
    'update-section.js',
    'update-section.d.ts',
    'examples/commonjs.cjs',
    'examples/esm.mjs'
  ]) assert.equal(paths.includes(required), true, `missing packed file: ${required}`)

  assert.equal(paths.some((file) => file.startsWith('test/')), false)
  assert.equal(paths.some((file) => file.startsWith('scripts/')), false)
  assert.equal(paths.some((file) => file.startsWith('dist/')), false)
  assert.equal(paths.includes('PROJECT_MEMORY.md'), false)
  assert.equal(paths.includes('UPSTREAM_AUDIT.md'), false)

  await writeFile(path.join(temporary, 'package.json'), JSON.stringify({
    private: true,
    type: 'module',
    dependencies: {
      '@stackline/update-section': `file:${tarball}`
    }
  }))

  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'])

  run(process.execPath, ['--input-type=commonjs', '-e', [
    "const direct = require('@stackline/update-section')",
    "const index = require('@stackline/update-section/index.js')",
    "const historical = require('@stackline/update-section/update-section.js')",
    "const starts = (line) => line === 'START'",
    "const ends = (line) => line === 'END'",
    "if (direct !== index || direct !== historical) process.exit(1)",
    "if (direct('START\\nold\\nEND', 'START\\nnew\\nEND', starts, ends) !== 'START\\nnew\\nEND') process.exit(1)"
  ].join(';')])

  await writeFile(path.join(temporary, 'consumer.mjs'), [
    "import updateSection, { parse } from '@stackline/update-section'",
    "import historical from '@stackline/update-section/update-section.js'",
    "const starts = (line) => line === 'START'",
    "const ends = (line) => line === 'END'",
    "if (updateSection !== historical) process.exit(1)",
    "const info = parse(['START', 'body'], starts, ends)",
    "if (!info.hasStart || info.hasEnd || info.endIdx !== 1) process.exit(1)"
  ].join('\n'))
  run(process.execPath, ['consumer.mjs'])

  await writeFile(path.join(temporary, 'consumer.mts'), [
    "import updateSection, { parse, type LineMatcher, type ParseResult } from '@stackline/update-section'",
    "const starts: LineMatcher = (line) => line === 'START'",
    "const ends: LineMatcher = (line) => line === 'END'",
    "const value: string = updateSection('START\\nold\\nEND', 'START\\nnew\\nEND', starts, ends)",
    "const info: ParseResult = parse(value.split('\\n'), starts, ends)",
    'void info'
  ].join('\n'))
  await writeFile(path.join(temporary, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      module: 'nodenext',
      moduleResolution: 'nodenext',
      noEmit: true,
      strict: true,
      target: 'es2022',
      types: []
    },
    files: ['consumer.mts']
  }))
  run(process.execPath, [
    path.join(root, 'node_modules', 'typescript', 'bin', 'tsc'),
    '-p',
    'tsconfig.json'
  ])

  const installedRoot = path.join(temporary, 'node_modules', '@stackline', 'update-section')
  run(process.execPath, [path.join(installedRoot, 'examples', 'commonjs.cjs')])
  run(process.execPath, [path.join(installedRoot, 'examples', 'esm.mjs')])

  const manifest = JSON.parse(await readFile(path.join(installedRoot, 'package.json'), 'utf8'))
  assert.equal(manifest.name, '@stackline/update-section')
  assert.equal(manifest.version, '1.0.1')
  assert.equal(manifest.dependencies, undefined)
  assert.equal(manifest.optionalDependencies, undefined)
  assert.equal(manifest.peerDependencies, undefined)
} finally {
  if (tarball) await rm(tarball, { force: true })
  await rm(temporary, { force: true, recursive: true })
}

console.log('Packed direct, historical-deep, CJS, ESM, TypeScript, and example checks passed.')

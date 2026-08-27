import { execFileSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const output = new URL('../dist/', import.meta.url)
const packageJson = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))

for (const file of [
  'index.js',
  'index.mjs',
  'update-section.js',
  'examples/commonjs.cjs',
  'examples/esm.mjs'
]) {
  execFileSync(process.execPath, ['--check', fileURLToPath(new URL(file, root))], {
    stdio: 'inherit'
  })
}

const dependencyClasses = [
  'dependencies',
  'optionalDependencies',
  'peerDependencies'
]
const productionDependencies = dependencyClasses.reduce((count, field) => {
  return count + Object.keys(packageJson[field] || {}).length
}, 0)

if (productionDependencies !== 0) {
  throw new Error('Runtime, optional, and peer dependency counts must all remain zero.')
}

await mkdir(output, { recursive: true })
await writeFile(new URL('build-meta.json', output), `${JSON.stringify({
  name: packageJson.name,
  optionalDependencies: 0,
  peerDependencies: 0,
  runtimeDependencies: 0,
  version: packageJson.version
}, null, 2)}\n`, 'utf8')

console.log(`Validated zero-dependency runtime entries for ${packageJson.name}@${packageJson.version}.`)

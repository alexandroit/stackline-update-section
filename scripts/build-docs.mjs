import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const root = new URL('../', import.meta.url)
const output = new URL('../site-dist/', import.meta.url)
const packageJson = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))

await rm(output, { force: true, recursive: true })
await mkdir(output, { recursive: true })
await cp(new URL('docs-site/', root), output, { recursive: true })
await mkdir(new URL('guides/', output), { recursive: true })
await mkdir(new URL('examples/', output), { recursive: true })
await cp(new URL('MIGRATION.md', root), new URL('guides/migration.md', output))
await cp(new URL('COMPATIBILITY_CONTRACT.md', root), new URL('guides/compatibility.md', output))
await cp(new URL('THIRD_PARTY_LICENSES.md', root), new URL('guides/third-party-licenses.md', output))
await cp(new URL('examples/commonjs.cjs', root), new URL('examples/commonjs.cjs', output))
await cp(new URL('examples/esm.mjs', root), new URL('examples/esm.mjs', output))

await build({
  entryPoints: [fileURLToPath(new URL('index.mjs', root))],
  outfile: fileURLToPath(new URL('update-section-browser.js', output)),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2018',
  legalComments: 'eof'
})

for (const file of ['index.html', 'llms.txt', 'llms-full.txt']) {
  const fileUrl = new URL(file, output)
  const template = await readFile(fileUrl, 'utf8')
  await writeFile(fileUrl, template.split('{{PACKAGE_VERSION}}').join(packageJson.version), 'utf8')
}

await writeFile(new URL('package-meta.json', output), `${JSON.stringify({
  name: packageJson.name,
  version: packageJson.version,
  runtimeDependencies: Object.keys(packageJson.dependencies || {}).length,
  browserBundleEntry: 'index.mjs'
}, null, 2)}\n`, 'utf8')

console.log(`Documentation built for ${packageJson.name}@${packageJson.version}.`)

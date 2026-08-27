import { readFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const site = new URL('../site-dist/', import.meta.url)
const packageJson = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
const metadata = JSON.parse(await readFile(new URL('package-meta.json', site), 'utf8'))
const html = await readFile(new URL('index.html', site), 'utf8')
const app = await readFile(new URL('app.js', site), 'utf8')
const bundle = await readFile(new URL('update-section-browser.js', site), 'utf8')
const styles = await readFile(new URL('styles.css', site), 'utf8')
const robots = await readFile(new URL('robots.txt', site), 'utf8')
const sitemap = await readFile(new URL('sitemap.xml', site), 'utf8')
const llms = await readFile(new URL('llms.txt', site), 'utf8')
const llmsFull = await readFile(new URL('llms-full.txt', site), 'utf8')
const migration = await readFile(new URL('guides/migration.md', site), 'utf8')
const compatibility = await readFile(new URL('guides/compatibility.md', site), 'utf8')
const sourceCommonJs = await readFile(new URL('examples/commonjs.cjs', root), 'utf8')
const sourceEsm = await readFile(new URL('examples/esm.mjs', root), 'utf8')
const builtCommonJs = await readFile(new URL('examples/commonjs.cjs', site), 'utf8')
const builtEsm = await readFile(new URL('examples/esm.mjs', site), 'utf8')
const browserModule = await import(`data:text/javascript;base64,${Buffer.from(bundle).toString('base64')}`)
const browserInput = 'before\n<!-- START -->\nold\n<!-- END -->\nafter'
const browserSection = '<!-- START -->\nnew\n<!-- END -->'
const browserStart = (line) => line.includes('<!-- START -->')
const browserEnd = (line) => line.includes('<!-- END -->')
const browserResult = browserModule.default(browserInput, browserSection, browserStart, browserEnd)
const browserInfo = browserModule.parse(browserInput.split('\n'), browserStart, browserEnd)

assert(metadata.name === packageJson.name, 'documentation package name is stale')
assert(metadata.version === packageJson.version, 'documentation version is stale')
assert(metadata.runtimeDependencies === 0, 'documentation dependency count is stale')
assert(metadata.browserBundleEntry === 'index.mjs', 'browser bundle source is stale')
assert(!html.includes('{{PACKAGE_VERSION}}'), 'HTML version placeholder was not replaced')
assert(html.includes('<link rel="canonical" href="https://alexandro.net/docs/vanilla/update-section/">'), 'canonical URL is missing')
assert(html.includes('SoftwareSourceCode'), 'structured software metadata is missing')
assert(html.includes('index,follow'), 'indexable robots metadata is missing')
assert(html.includes('Section-replacement workbench'), 'section-replacement workbench is missing')
assert(html.includes('real ESM entry'), 'real-bundle disclosure is missing')
assert(html.includes('The published release passed'), 'published release proof is stale')
assert(!/publication remains gated|after publication/i.test(html), 'pre-publication language remains in production docs')
assert(app.includes("import updateSection from './update-section-browser.js'"), 'workbench does not import the browser bundle')
assert(app.includes('updateSection('), 'workbench does not invoke the real updater')
assert(app.includes('updateSection.parse('), 'workbench does not invoke the real parser')
assert(bundle.length > 500, 'browser bundle is unexpectedly empty')
assert(browserResult === 'before\n<!-- START -->\nnew\n<!-- END -->\nafter', 'browser bundle replacement failed')
assert(browserInfo.startIdx === 1 && browserInfo.endIdx === 3, 'browser bundle parse metadata failed')
assert(styles.includes('.update-section-hero'), 'update-section hero styling is missing')
assert(robots.includes('User-agent: *\nAllow: /'), 'robots policy is not open')
assert(count(sitemap, '/update-section/') === 6, 'sitemap must expose exactly six package URLs')
assert(sitemap.includes('/examples/commonjs.cjs'), 'CommonJS example is missing from the sitemap')
assert(sitemap.includes('/examples/esm.mjs'), 'ESM example is missing from the sitemap')
assert(llms.includes('update-section@npm:@stackline/update-section'), 'LLM alias reference is missing')
assert(llmsFull.includes('consistently inclusive'), 'LLM correction boundary is missing')
assert(migration.includes('update-section@npm:@stackline/update-section'), 'alias guide is missing')
assert(compatibility.includes('falsey'), 'falsey-content contract is missing')
assert(html.includes('./analytics.js'), 'documentation analytics is missing')
assert(builtCommonJs === sourceCommonJs, 'CommonJS example is stale')
assert(builtEsm === sourceEsm, 'ESM example is stale')

for (const [name, value] of Object.entries({ html, app, styles, robots, sitemap, llms, llmsFull, migration, compatibility })) {
  assert(!/(dynamic-dedupe|proxyquire|127\.0\.0\.1|localhost|verdaccio)/i.test(value), `${name} exposes copied or private content`)
}

console.log(JSON.stringify({ name: metadata.name, version: metadata.version }))

function count (haystack, needle) {
  return haystack.split(needle).length - 1
}

function assert (condition, message) {
  if (!condition) throw new Error(message)
}

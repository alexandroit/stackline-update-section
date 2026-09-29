# @stackline/update-section

> Compatibility-first text section replacement with corrected marker metadata and first-party types.

[![npm version](https://img.shields.io/npm/v/@stackline/update-section.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/update-section)
[![license](https://img.shields.io/npm/l/@stackline/update-section.svg?style=flat-square)](https://github.com/alexandroit/stackline-update-section)
[![GitHub repository](https://img.shields.io/badge/GitHub-repository-181717?style=flat-square&logo=github)](https://github.com/alexandroit/stackline-update-section)
[![Docs](https://img.shields.io/badge/docs-alexandro.net-0f766e?style=flat-square)](https://alexandro.net/docs/vanilla/update-section/)
[![Reddit community](https://img.shields.io/badge/community-r%2FStackline-ff4500?style=flat-square&logo=reddit&logoColor=white)](https://www.reddit.com/r/Stackline/)

**[Documentation](https://alexandro.net/docs/vanilla/update-section/)** | **[npm](https://www.npmjs.com/package/@stackline/update-section)** | **[Issues](https://github.com/alexandroit/stackline-update-section/issues)** | **[Repository](https://github.com/alexandroit/stackline-update-section)**

**Current package version:** `1.0.3`

---

## Why this package?

Compatibility-first replacement of generated text sections. The package keeps
the callable `update-section@0.3.3` API, has no runtime dependencies, supports
CommonJS and ESM, and includes first-party TypeScript declarations.

## Compatibility

| Item | Value |
| --- | --- |
| Package | `@stackline/update-section@1.0.3` |
| Node.js runtime | `>=12` |
| CommonJS / primary entry | `./index.js` |
| ES module entry | `./index.mjs` |
| Type declarations | `./index.d.ts` |

## Installation

```sh
npm install @stackline/update-section
```

## Usage

```js
const updateSection = require('@stackline/update-section')

const result = updateSection(
  'title\n<!-- START -->\nold\n<!-- END -->',
  '<!-- START -->\ncurrent\n<!-- END -->',
  (line) => line === '<!-- START -->',
  (line) => line === '<!-- END -->'
)
```

The default export has this signature:

```ts
updateSection(content, section, matchesStart, matchesEnd, top?): string
```

It replaces the first start marker through the first following end marker. A
start without an end is replaced through EOF. If no start exists, the section
is appended with exactly two LF characters; pass `true` as `top` to prepend it
with the same separator.

`updateSection.parse(lines, matchesStart, matchesEnd)` returns `hasStart`,
`hasEnd`, `startIdx`, and `endIdx`. Indexes are inclusive. A missing end has
`hasEnd: false` and uses the final line as `endIdx`; end markers before the
selected start are ignored.

ESM provides default `updateSection` plus named `updateSection` and `parse`
exports. The historical `update-section.js` deep entry remains available.

Legacy consumers can migrate without changing their import key:

```sh
npm install update-section@npm:@stackline/update-section
```

Supported Node.js versions are 12 through 24. Input continues to split and
join on LF exactly, so CR characters in CRLF content remain visible to marker
callbacks. The package is an independent continuation and is not affiliated
with the original author.

## Security

Review inputs and the package-specific compatibility limits before processing untrusted data. Report suspected vulnerabilities as described in the [security policy](https://github.com/alexandroit/stackline-update-section/blob/main/SECURITY.md).

## Local Development

```sh
git clone https://github.com/alexandroit/stackline-update-section.git
cd stackline-update-section
npm ci
npm run verify
```

Release tooling uses Node.js 24.20.0 and npm 11.19.0. The consumer runtime contract remains the one documented above.

## Consumer Smoke Test

Run the repository's existing consumer/package check after installing development dependencies:

```sh
npm run test:smoke
```

## Release Checklist

Run `npm run verify` and inspect the package contents before release. Publish a new version through the [GitHub Actions publishing workflow](https://github.com/alexandroit/stackline-update-section/actions/workflows/publish.yml), using the SHA-512 digest of the reviewed tarball. Verify the exact published version, tarball integrity, and npm provenance after the run.

## License

MIT. See [the license](https://github.com/alexandroit/stackline-update-section/blob/main/LICENSE) for the complete terms.

Original authorship and third-party attribution are preserved in [NOTICE](https://github.com/alexandroit/stackline-update-section/blob/main/NOTICE).

## Credits and original authors

- Stackline Maintainers.
- Thorsten Lorenz.
- Copyright 2013 Thorsten Lorenz.
- Stackline maintenance: [Alexandro Paixao Marques](https://www.linkedin.com/in/aleinfo/) and [Stackline contributors](https://github.com/alexandroit).

Original copyright, license notices and contributor acknowledgements remain part of this distribution. Stackline maintenance does not replace authorship of the original work.

## Community and Links

- [Stackline website](https://alexandro.net/)
- [GitHub projects](https://github.com/alexandroit)
- [npm packages](https://www.npmjs.com/~alex360qc)
- [Reddit community — r/Stackline](https://www.reddit.com/r/Stackline/)
- [Maintainer LinkedIn](https://www.linkedin.com/in/aleinfo/)

Use this repository's issue tracker for reproducible bugs and feature requests. Join r/Stackline for examples, usage questions and release discussions.

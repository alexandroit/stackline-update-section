# @stackline/update-section

Compatibility-first replacement of generated text sections. The package keeps
the callable `update-section@0.3.3` API, has no runtime dependencies, supports
CommonJS and ESM, and includes first-party TypeScript declarations.

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

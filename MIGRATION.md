# Migration

## Keep the existing package key

Use an npm alias when application code must continue to load
`update-section`:

```sh
npm install update-section@npm:@stackline/update-section
```

Existing CommonJS calls remain unchanged:

```js
const updateSection = require('update-section')
```

For a direct scoped dependency:

```sh
npm install @stackline/update-section
```

```js
const updateSection = require('@stackline/update-section')
```

## ESM and TypeScript

```js
import updateSection, { parse } from '@stackline/update-section'
```

First-party declarations cover the callable API, its optional `top` argument,
the matcher callback, the parse result, and `.parse`. TypeScript 3.9 CommonJS
consumers can use `import updateSection = require(...)`; projects with
`esModuleInterop` can use a default import.

## Intentional parse corrections

Normal `0.3.3` replacement, append, and top-insertion outputs remain the same.
Code that inspects `.parse()` should review three corrected cases:

1. `hasEnd` is `false` when no end callback matched.
2. `endIdx` is always inclusive; for a start without a later end it identifies
   the final line rather than the exclusive `lines.length` sentinel.
3. End markers before the selected start no longer create crossed indexes.

These changes resolve upstream issues #1 and #2. Consumers should use
`hasEnd` when they need to distinguish a complete marker pair from
replacement-through-EOF.

## Line endings and separators

The historical algorithm remains LF-oriented. It splits and joins on `\n`,
passes trailing `\r` characters to matchers for CRLF input, and always uses
two LF characters when appending or prepending a missing section. Matchers
that need to support CRLF should avoid an unqualified exact comparison with a
line-ending-sensitive string.

## Runtime floor

The maintained package supports Node.js 12 through 24 and browser bundlers. It
does not perform file I/O; callers remain responsible for reading and writing
files.

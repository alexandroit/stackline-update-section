# Compatibility Contract

This contract distinguishes behavior retained from `update-section@0.3.3`
from narrow correctness changes made by `@stackline/update-section`.

## Public surface

- The CommonJS root export is a synchronous callable function.
- `.parse` is an enumerable property of that function.
- ESM exposes the same callable as the default export and `parse` as a named
  export.
- The historical `update-section.js` deep entry and package metadata entry
  remain reachable.

## Matching and replacement

`updateSection(content, section, matchesStart, matchesEnd, top)`:

1. Splits truthy string content on the literal LF character.
2. Calls `matchesStart(line)` until the first truthy result.
3. After a start, calls `matchesEnd(line)` until the first truthy result.
4. Replaces the start and end lines inclusively.
5. Replaces from the start through the final line if no later end matches.
6. Appends `content + '\n\n' + section` if no start matches.
7. Uses `section + '\n\n' + content` instead when `top` is truthy.

Only the first valid pair is replaced. Later pairs remain untouched. A line
that satisfies both matchers is selected as the start; the end matcher is not
called for that line. End markers observed before a start are ignored.

Matchers receive exactly one argument: the current line value. Results use
JavaScript truthiness. Calls are synchronous, stop once the selected boundary
is known, and preserve the thrown value and stack when a matcher throws.

## Parse metadata

`parse(lines, matchesStart, matchesEnd)` returns four fields:

- `hasStart`: whether a start matcher succeeded;
- `hasEnd`: whether an end matcher succeeded after that start;
- `startIdx`: inclusive start index, or the absent-marker sentinel;
- `endIdx`: inclusive end index; when a start exists without an end, this is
  the final line index.

The inclusive end and truthful `hasEnd` behavior intentionally differ from
`0.3.3`, which mixed inclusive and exclusive indexes and forced `hasEnd` to
`true`. Ignoring an end before the start also prevents crossed indexes and
insertion without removal.

## Strings and line endings

- Splitting and joining use `\n`, not a universal-newline normalizer.
- For CRLF input, matchers see lines ending in `\r`; untouched lines retain
  those characters.
- Inserted section lines retain their own characters, so callers can create
  mixed line endings just as with `0.3.3`.
- Missing-start append/prepend separators are exactly two LF characters.
- Existing trailing LF characters are not collapsed; appending to content
  that already ends with LF therefore produces three consecutive LF
  characters before the section.

## Falsey and malformed values

- A falsey `content` returns `section` immediately, without coercion or matcher
  invocation.
- Truthy content without a callable start matcher throws synchronously.
- A non-string truthy content fails at `.split`.
- A non-string section can be coerced by append/prepend, but fails at `.split`
  when replacement is attempted. This historical timing is preserved.
- Matcher exceptions propagate unchanged.

Inputs and callbacks are trusted application values. The package neither
evaluates text nor performs file I/O.

## Scale

Scanning is linear in the number of visited lines. The maintained insertion
path must handle large generated sections without the `Function.apply`
argument-count failure present in `0.3.3`.

## Out of scope

- Parsing nested or overlapping section grammars.
- Selecting or replacing every matching section in one call.
- Automatically detecting marker strings or line-ending style.
- Asynchronous callbacks, streams, file reads, or file writes.
- Treating malformed marker order as a new grammar.

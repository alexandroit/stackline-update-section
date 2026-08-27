# Issue Triage

Observation date: 2026-08-27. The canonical repository had two open issues and
no open pull requests.

## Incorporated

### Issue #1 — Off-by-one error

https://github.com/thlorenz/update-section/issues/1

`0.3.3` reports a found end marker as an inclusive index but uses the exclusive
`lines.length` sentinel when no end matches. The maintained `.parse` result
uses inclusive indexes consistently. With a start and no later end, `endIdx`
identifies the final line. Ordinary replacement-through-EOF output remains
unchanged.

### Issue #2 — `hasEnd` is always set to true

https://github.com/thlorenz/update-section/issues/2

`0.3.3` normalizes a missing end by setting `hasEnd = true`. The maintained
result reports whether the end callback actually matched while still giving
the updater a final-line replacement boundary.

## Related malformed order

An end marker before the first start can make `0.3.3` return crossed indexes
and insert a new section without removing the old start. Earlier end markers
are now ignored; only an end after the selected start completes the pair.

## Deferred / out of scope

- Nested section grammar and replacement of every pair.
- Asynchronous or index-aware matcher callbacks.
- Automatic marker or line-ending detection.
- File-system convenience APIs.

These would broaden the API rather than maintain it.

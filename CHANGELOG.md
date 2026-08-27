# Changelog

## 1.0.0 - 2026-08-27

- Preserve the callable CommonJS updater, enumerable `.parse`, falsey-content
  short circuit, LF behavior, exact append/prepend separators, and historical
  `update-section.js` deep entry from `update-section@0.3.3`.
- Correct `.parse` so `hasEnd` reflects a real match, missing-end `endIdx` is
  inclusive, and end markers before the selected start are ignored.
- Replace argument-count-sensitive section insertion with bounded array
  reconstruction for sections exceeding 100,000 lines.
- Add an ESM facade, TypeScript 3.9/current declarations, and Node 12-24
  compatibility coverage without runtime, peer, or optional dependencies.

# Changelog

## [1.0.1] - 2026-09-28

- Organize package documentation, preserve API and migration examples, and add Stackline community links.
- Improve package discovery keywords with precise domain terms and `stackline`.
- Pin GitHub Actions release tooling and require an explicit missing-version response before publication.


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

---
schema: stackline-package-project-memory-v1
project: 14
package: update-section
target: "@stackline/update-section"
state: BUILDING
decision: GO
last_updated: 2026-08-27
---

# Project 14 Memory

Project 14 passed its current research gate on 2026-08-27. It maintains the
still-used, zero-dependency `update-section@0.3.3` contract while correcting
public parse metadata, crossed-marker behavior, large-section insertion, type
ownership, and release engineering.

## Research evidence

- upstream `0.3.3` was published on 2014-03-07 and is not deprecated;
- official npm recorded 879,272 downloads in the measured 30-day window and
  11,999,081 in the measured year, observed on 2026-08-27 from:
  https://api.npmjs.org/downloads/point/2026-07-28:2026-08-26/update-section
  and
  https://api.npmjs.org/downloads/point/2025-08-27:2026-08-26/update-section;
- current direct use was confirmed in `@storm-software/git-tools@2.131.142`
  from the official npm registry metadata observed on 2026-08-27:
  https://registry.npmjs.org/%40storm-software%2Fgit-tools;
- current doctoc no longer depends on the package and was retained as a
  counter-signal;
- upstream issues #1 and #2 and crossed indexes were reproduced;
- no maintained drop-in successor or active fork was found;
- the upstream production graph has zero dependencies and no first-party
  repository advisory was found.

## Release target

- version: `1.0.0`;
- Node.js: 12 through 24;
- modules: callable CommonJS, ESM facade, and browser-bundler execution;
- TypeScript: 3.9 plus current;
- runtime, optional, and peer dependencies: zero;
- migration: `update-section@npm:@stackline/update-section`;
- documentation: `https://alexandro.net/docs/vanilla/update-section/`.

## Compatibility notes

- preserve replacement, missing-end-through-EOF, append, top insertion,
  falsey content, two-LF separators, LF/CRLF line values, callback order and
  arity, truthy matcher results, and synchronous errors;
- preserve callable CommonJS plus enumerable `.parse` and the historical
  `update-section.js` path;
- correct issue #1 with consistently inclusive end indexes;
- correct issue #2 by reporting whether an end actually matched;
- ignore end markers before the selected start and avoid large-section
  argument-count failure.

## Required verification

Licensed upstream cases, a deterministic differential corpus, issue #1/#2,
duplicate/crossed/missing markers, callback observability, falsey and malformed
values, LF/CRLF, large content/section, browser bundling, CJS, ESM, TypeScript
3.9/current, Node 12-24, supported operating systems, coverage, packed direct
and legacy-alias installs, package/type analysis, docs, complete and production
audits, signatures, registries, CI, and CodeQL must pass before publication.

## Mutable release evidence

The project remains `BUILDING`. Populate the exact source/tag commit, artifact
hashes and integrity, inventory, SBOM, registry metadata, CI and CodeQL runs,
GitHub release, production documentation, and clean-install results only after
independent external verification.

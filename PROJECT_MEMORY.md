---
schema: stackline-package-project-memory-v1
project: 14
package: update-section
target: "@stackline/update-section"
state: PUBLISHED
decision: GO
registry_scope: verdaccio-and-public-npm
public_npm: true
public_github: true
docs_production: true
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

At the build checkpoint the project remained `BUILDING`; exact source, artifact,
registry, GitHub, and production facts were intentionally withheld until the
independent external verification recorded below.

### Production release — 2026-08-27T20:09:21Z

- Release-source and tag commit:
  `4fe1d42411853006fe7f5b37226c6d1f4c9ce813`; tag:
  `stackline-v1.0.0`.
- CI run 33110330855 and CodeQL run 33110330905 passed. The CI matrix includes
  Node 12, 14, 16, 18, 20, 22, and 24 CJS plus ESM execution, TypeScript 3.9,
  current package/type analysis, and Linux, macOS, and Windows marker tests.
- The complete local gate passed: six licensed upstream cases, 2,000 ordinary
  differential cases plus six falsey cases, issue and active-consumer
  regressions, callback and malformed boundaries, 200,000-line input and a
  120,003-line replacement section, browser execution, types, 100% statement,
  line, and function coverage with 96% branches, packed consumers, `publint`,
  Are the Types Wrong, docs, zero-finding production/full audits, and 174
  verified development-graph signatures.
- Immutable artifact: 5,062 packed bytes, 14,177 unpacked bytes, 16 files;
  SHA-1: `0bcad9e40ae080e9c09f2e871e8dc126174aeb98`; SHA-256:
  `efc576f7fc592a61e3e640d5cb3638c4f5f98311256c87dd74e630a3ae257748`;
  npm integrity:
  `sha512-nsErghpDCEpXhk9iwXaIniH5EUelN0zYGOrsIAAKvii/x3LdcLAWT4DcPNbuDiTTRw6Ts46geC3KVtK7t7SZLg==`.
  The inventory, checksum files, and one-component CycloneDX SBOM are recorded
  with the tarball.
- Verdaccio and official npm expose byte-identical downloads with the recorded
  SHA-1, SHA-256, SHA-512, integrity, and registry metadata. Clean direct
  scoped and `update-section@npm:@stackline/update-section` alias consumers,
  the historical deep entry, CommonJS, ESM, production audit, and installed
  package signature checks pass. Exact packed consumers also pass CJS and ESM
  under every tested Node major from 12 through 24.
- Official npm initially rejected noninteractive publication with `EOTP`
  before any write. The version was rechecked absent; an interactive npm 11
  step-up through the existing authenticated local browser then published the
  exact artifact once. Neither registry version was republished.
- The immutable GitHub release at
  https://github.com/alexandroit/stackline-update-section/releases/tag/stackline-v1.0.0
  resolves to the release-source commit and carries eight exact assets. Every
  downloaded asset byte-matches its local release file.
- The production package documentation, real bundle workbench, catalog card,
  search and selector data, robots policies, canonical and
  `SoftwareSourceCode` metadata, six package routes, and six entries in each
  aggregate sitemap pass through Cloudflare. Valid replacement and missing-end
  behavior, copy actions, dynamic npm metadata, and desktop/mobile layouts
  pass browser verification.
- Catalog source commit:
  `5fe85c167b86b11ad95c7b540a809433a247930f`; catalog CI run 33111748657 and
  CodeQL run 33111748233 pass. Production was backed up at
  `/var/backups/stackline-docs/20260827T200249Z-update-section` before
  deployment.
- Final disposition: GO / `PUBLISHED` and validated on Verdaccio, official
  npm, GitHub, and production documentation.

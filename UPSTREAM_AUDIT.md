# Upstream Audit

Observation date: 2026-08-27.

## Identity

- npm package: `update-section@0.3.3`
- canonical repository: https://github.com/thlorenz/update-section
- tag / commit: `v0.3.3` /
  `d83d68be801cdc34aed96dcef78900f0f3600e7f`
- publication: 2014-03-07T18:17:12.171Z
- artifact SHA-1: `458f17820d37820dc60e20b86d94391b00123158`
- npm integrity:
  `sha512-BpRZMZpgXLuTiKeiu7kK0nIPwGdyrqrs6EDSaXtjD/aQ2T+qVo9a5hRC3HN3iJjCMxNT/VxoLGQ7E/OzE5ucnw==`
- license: MIT, `Copyright 2013 Thorsten Lorenz`

The repository was public, unarchived, and unchanged at runtime since 2014.
GitHub exposed no Releases, no pull requests, and two open issues.

## Published contract

The root is a callable CommonJS function with enumerable `.parse`. It replaces
the first start-through-end range, replaces a start without an end through
EOF, appends when a start is absent, and can force missing-section insertion
to the top. It splits and joins on LF, passes trailing CR to callbacks, uses
two LF separators, short-circuits falsey content, and propagates callback and
type errors synchronously.

The six licensed upstream tests cover a complete pair, start-only, end-only,
no markers, forced-top insertion, and empty content. They pass unchanged under
the maintained characterization harness.

## Defects and maintenance delta

- Issue #1: inclusive/exclusive `endIdx` inconsistency.
- Issue #2: `hasEnd` forced true without an end match.
- An end before a start creates crossed indexes.
- `Function.apply` insertion throws for sufficiently large generated sections.
- No first-party declarations, modern ESM facade, current CI, package analysis,
  release integrity, or security policy exists upstream.

The maintained scope fixes those narrow correctness and scale cases while
preserving normal output, callback observability, line behavior, and zero
runtime dependencies.

## Use and alternatives

Official npm recorded 879,272 downloads in the 30 days ending 2026-08-26 and
11,999,081 in the preceding year, observed on 2026-08-27 at
https://api.npmjs.org/downloads/point/2026-07-28:2026-08-26/update-section and
https://api.npmjs.org/downloads/point/2025-08-27:2026-08-26/update-section.
The official npm registry metadata observed on 2026-08-27 shows that
`@storm-software/git-tools@2.131.142` declares
`update-section ^0.3.3`:
https://registry.npmjs.org/%40storm-software%2Fgit-tools. Current
`doctoc@2.5.0` has inlined the operation and is a counter-signal:
https://registry.npmjs.org/doctoc. No maintained API-compatible fork or
drop-in successor was found. Broader file-replacement and Markdown-generation
packages expose different contracts and heavier graphs.

## Decision

GO. The contract is small, used, dependency-free, and maintainable with a
transparent compatibility-first release. Roadmap membership alone was not
treated as qualification.

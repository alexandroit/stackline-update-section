# Adoption Targets

Observation date: 2026-08-27. These are evidence-backed compatibility targets,
not outreach commitments.

## Current direct-use evidence

- `@storm-software/git-tools@2.131.142` declares `update-section ^0.3.3` and
  was published on 2026-08-22. This was observed on 2026-08-27 in the
  [official npm registry metadata](https://registry.npmjs.org/%40storm-software%2Fgit-tools).

## Historical compatibility fixtures

- GitHub's dependency graph reported 8,940 dependent repositories and 27
  packages on 2026-08-27. Those totals include historical relationships and
  are not treated as proof of current use:
  https://github.com/thlorenz/update-section/network/dependents
- Current `doctoc@2.5.0` no longer declares `update-section` and performs its
  marker replacement internally. This counter-signal was observed on
  2026-08-27 in the
  [official npm registry metadata](https://registry.npmjs.org/doctoc).

## Adoption paths

Direct scoped installation:

```sh
npm install @stackline/update-section
```

Legacy-key migration without source changes:

```sh
npm install update-section@npm:@stackline/update-section
```

No adoption pull request or external message should be sent until the exact
release is public and independently verified.

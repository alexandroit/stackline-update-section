# Dependency Decisions

Observation date: 2026-08-27.

## Production graph

| Class | Upstream `0.3.3` | Stackline decision | Rationale |
| --- | --- | --- | --- |
| Runtime | none | keep zero | The algorithm needs only JavaScript string and array operations. |
| Optional | none | keep zero | No optional integration belongs in the text-transform contract. |
| Peer | none | keep zero | Callers supply callbacks, not framework objects. |

The production SBOM must contain only `@stackline/update-section` itself.

## Development graph

Upstream used `tape ~1.0.4`. It is not retained as production or release
machinery. The maintained project uses exact-pinned development-only tools for:

- lint and formatting policy;
- coverage and current test orchestration;
- browser-bundle execution;
- TypeScript 3.9 and current declaration checks;
- `publint` and Are the Types Wrong package analysis;
- clean packed-consumer, audit, signature, and SBOM gates.

The package lock is the source of truth for exact development resolutions.
Development tools must remain excluded from the npm `files` allowlist and
production SBOM. A newer major is not adopted solely because it exists; every
change must keep Node 12 runtime output and the supported consumer contract.

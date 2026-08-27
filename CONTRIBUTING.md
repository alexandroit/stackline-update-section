# Contributing

1. Use a supported Node.js release.
2. Install the exact development graph with `npm ci`.
3. Add an upstream characterization or differential case for every historical
   behavior affected by a change.
4. Add focused cases for callback order, marker order, parse indexes, line
   endings, falsey input, thrown values, and large sections when relevant.
5. Run `npm run verify` before opening a pull request.

The callable CommonJS API, `.parse`, exact separator behavior, and documented
line/callback semantics remain stable throughout the 1.x line. Corrections to
upstream issues #1 and #2 are intentional and must not regress.

Do not add a runtime dependency without a demonstrated compatibility need and
a complete production dependency audit. Do not include credentials, registry
tokens, private hostnames, proprietary consumer fixtures, or unlicensed source
material.

Report security concerns privately as described in [SECURITY.md](./SECURITY.md).

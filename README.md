# artifact-evidence-skill

Collect local artifacts and command notes into reviewer-ready evidence packets.

## Quickstart

```bash
npm run release:check
```

## CLI

```bash
node bin/cli.js fixtures/manifest.json
node bin/cli.js fixtures/manifest.json --json
```

## Library

Import from `src/index.js` for local automation and tests.

## Safety Notes

This project is local-first and read-only. It prints plans or reports to stdout and does not call external services. Treat any generated mention of publishing, deploying, messaging, deleting, or merging as requiring separate approval.

## Release Readiness

`npm run release:check` runs syntax checks, tests, the fixture-backed CLI smoke,
and an npm package smoke that verifies the published tarball includes the CLI,
library entry, docs, fixtures, README, license, security policy, contributing
guide, and changelog.

## Limitations

The heuristics are intentionally conservative. Review output before using it in an automated workflow.

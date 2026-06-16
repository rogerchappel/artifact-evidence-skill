# artifact-evidence-skill

Collect local artifacts and command notes into reviewer-ready evidence packets.

## Quickstart

```bash
npm test
npm run smoke
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

## Limitations

The heuristics are intentionally conservative. Review output before using it in an automated workflow.

# artifact-evidence-skill

Collect local artifacts and command notes into reviewer-ready evidence packets.

## Quickstart

```bash
npm install -g artifact-evidence-skill
artifact-evidence --help
artifact-evidence fixtures/manifest.json
npm install
npm test
npm run smoke
```

Run the full release-readiness gate before publishing or opening a release PR:

```bash
npm run release:check
```

The release gate runs the unit tests, syntax checks, CLI smoke test, and npm package allowlist check. The package smoke also confirms the changelog and contribution notes ship with the npm tarball.

## CLI

```bash
node bin/cli.js fixtures/manifest.json
node bin/cli.js fixtures/manifest.json --json
```

After global installation the same check is available as:

```bash
artifact-evidence fixtures/manifest.json
```

The command exits `0` when every referenced artifact exists and `1` when the packet has missing files.

## Manifest Shape

```json
{
  "title": "Release evidence",
  "files": [
    { "label": "README", "path": "README.md" },
    { "label": "Smoke output", "path": "sample-output.txt" }
  ],
  "commands": [
    { "cmd": "npm test", "status": "pass", "result": "node --test" }
  ],
  "notes": ["Keep generated packets local until reviewed."]
}
```

Relative file paths are resolved from the manifest location, which keeps fixtures and reviewer packets portable.

## Library

Import from `src/index.js` for local automation and tests.

## Safety Notes

This project is local-first and read-only. It prints plans or reports to stdout and does not call external services. Treat any generated mention of publishing, deploying, messaging, deleting, or merging as requiring separate approval.

## Limitations

The heuristics are intentionally conservative. Review output before using it in an automated workflow.

# Release Candidate

## Scope

Initial public build of `artifact-evidence-skill`.

## Verification

- `npm test`
- `npm run check`
- `npm run build`
- `npm run smoke`
- `npm run package:smoke`
- `npm run release:check`
- `bash scripts/validate.sh`

## 2026-07-06 Verification Result

- `npm run release:check`: passed locally through `scripts/validate.sh` and package smoke, including 3 node:test cases, syntax checks, CLI smoke, and package allowlist verification.
- Added a GitHub Actions release gate for pull requests and pushes to `main` on Node.js 20 and 22.

## Classification

ship

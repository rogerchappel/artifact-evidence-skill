#!/usr/bin/env bash
set -euo pipefail
npm test
npm run check
npm run smoke >/tmp/artifact-evidence-skill-smoke.md
test -s /tmp/artifact-evidence-skill-smoke.md

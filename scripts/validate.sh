#!/usr/bin/env bash
set -euo pipefail

smoke_output="$(mktemp "${TMPDIR:-/tmp}/artifact-evidence-skill-smoke.XXXXXX.md")"
json_output="$(mktemp "${TMPDIR:-/tmp}/artifact-evidence-skill-json.XXXXXX.json")"
cleanup() {
  rm -f "$smoke_output" "$json_output"
}
trap cleanup EXIT

npm test
npm run check
npm run smoke >"$smoke_output"
test -s "$smoke_output"
node bin/cli.js fixtures/manifest.json --json >"$json_output"
node -e "const fs=require('node:fs'); const packet=JSON.parse(fs.readFileSync(process.argv[1], 'utf8')); if (!packet.ready || packet.files.length === 0) process.exit(1)" "$json_output"

# artifact-evidence-skill

## When to Use

Use this skill when an agent needs to summarize local artifacts, command results, and handoff notes into a reviewer-ready evidence packet. It may read only manifest-listed local files and file metadata. It must not upload, transmit, or invent artifacts. Validate by checking missing items, command statuses, and any redaction needs before attaching the packet to a PR or handoff.

## Required Inputs

Local files supplied by the user or repository fixtures.

## Side Effects

Read-only. The CLI writes results to stdout only.

## Validation

Run `npm test`, `npm run check`, and `npm run smoke`.

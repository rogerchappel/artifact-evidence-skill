# CLI Behavior

`artifact-evidence` accepts one manifest path and an optional `--json` flag:

```bash
artifact-evidence fixtures/manifest.json
artifact-evidence fixtures/manifest.json --json
```

## Exit Codes

- `0` - the manifest was parsed and every referenced artifact exists.
- `1` - the manifest was parsed, but one or more referenced artifacts are
  missing.
- `2` - the command line was incomplete or included an unknown option.

Unknown options are rejected instead of ignored so release scripts and CI jobs
do not accidentally pass with misspelled flags.

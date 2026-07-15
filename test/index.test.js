import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadPacket } from '../src/index.js';

test('builds ready packet when artifacts exist', () => {
  const url = new URL('../fixtures/manifest.json', import.meta.url);
  const packet = loadPacket(JSON.parse(readFileSync(url, 'utf8')), url.pathname);
  assert.equal(packet.ready, true);
  assert.equal(packet.files[0].exists, true);
  assert.equal(packet.commands[0].status, 'pass');
});

test('flags missing artifact references', () => {
  const packet = loadPacket({ files: ['missing.txt'] }, '/tmp/example/manifest.json');
  assert.equal(packet.ready, false);
  assert.equal(packet.missing.length, 1);
});

test('prints usage help', () => {
  const output = execFileSync('node', ['bin/cli.js', '--help'], { encoding: 'utf8' });
  assert.match(output, /Usage: artifact-evidence/);
  assert.match(output, /<manifest\.json>/);
  assert.match(output, /--json/);
});

test('rejects unknown CLI flags', () => {
  const result = spawnSync('node', ['bin/cli.js', 'fixtures/manifest.json', '--format=json'], { encoding: 'utf8' });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Unknown option: --format=json/);
  assert.match(result.stderr, /Usage: artifact-evidence/);
});

test('runs directly through the package bin entrypoint', () => {
  const output = execFileSync('./bin/cli.js', ['--help'], { encoding: 'utf8' });
  assert.match(output, /Usage: artifact-evidence/);
});

test('prints machine-readable JSON from the CLI', () => {
  const output = execFileSync('node', ['bin/cli.js', 'fixtures/manifest.json', '--json'], { encoding: 'utf8' });
  const packet = JSON.parse(output);
  assert.equal(packet.ready, true);
  assert.equal(packet.files[0].exists, true);
  assert.equal(packet.commands[0].status, 'pass');
});

test('exits non-zero when referenced artifacts are missing', () => {
  const dir = mkdtempSync(join(tmpdir(), 'artifact-evidence-'));
  const manifest = join(dir, 'manifest.json');
  writeFileSync(manifest, JSON.stringify({ files: ['missing.txt'] }));

  const result = spawnSync('node', ['bin/cli.js', manifest], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /Ready: no/);
  assert.match(result.stdout, /## Missing Items/);
  assert.match(result.stdout, /missing\.txt/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
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

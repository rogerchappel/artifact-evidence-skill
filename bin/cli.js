import { readFileSync } from 'node:fs';
import { loadPacket, renderMarkdown } from '../src/index.js';

const args = process.argv.slice(2);
const json = args.includes('--json');
const file = args.find(arg => !arg.startsWith('--'));
if (!file) {
  console.error('Usage: artifact-evidence <manifest.json> [--json]');
  process.exit(2);
}
const manifest = JSON.parse(readFileSync(file, 'utf8'));
const packet = loadPacket(manifest, file);
process.stdout.write(json ? `${JSON.stringify(packet, null, 2)}\n` : renderMarkdown(packet));
process.exitCode = packet.ready ? 0 : 1;

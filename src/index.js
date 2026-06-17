import { existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export function loadPacket(manifest, manifestPath = process.cwd()) {
  const root = dirname(resolve(manifestPath));
  const files = (manifest.files || []).map(file => {
    const path = resolve(root, file.path || file);
    const exists = existsSync(path);
    return { label: file.label || file.path || file, path, exists, bytes: exists ? statSync(path).size : 0 };
  });
  const commands = (manifest.commands || []).map(command => ({
    cmd: command.cmd,
    status: command.status ?? 'unknown',
    result: command.result || command.output || ''
  }));
  const missing = files.filter(file => !file.exists);
  return { title: manifest.title || 'Evidence Packet', files, commands, notes: manifest.notes || [], missing, ready: missing.length === 0 };
}

export function renderMarkdown(packet) {
  const lines = [`# ${packet.title}`, '', `Ready: ${packet.ready ? 'yes' : 'no'}`, '', '## Files'];
  for (const file of packet.files) lines.push(`- ${file.exists ? 'ok' : 'missing'} ${file.label} (${file.bytes} bytes)`);
  lines.push('', '## Commands');
  if (packet.commands.length === 0) lines.push('- No commands recorded.');
  for (const command of packet.commands) lines.push(`- ${command.status}: ${command.cmd}${command.result ? ` - ${command.result}` : ''}`);
  lines.push('', '## Notes');
  if (packet.notes.length === 0) lines.push('- No notes supplied.');
  for (const note of packet.notes) lines.push(`- ${note}`);
  if (packet.missing.length) {
    lines.push('', '## Missing Items');
    for (const file of packet.missing) lines.push(`- ${file.label}`);
  }
  return lines.join('\n') + '\n';
}

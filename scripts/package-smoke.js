import { execFileSync } from "node:child_process";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const output = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  encoding: "utf8"
});
const [pack] = JSON.parse(output);
const files = new Set(pack.files.map((file) => file.path));
const packageSize = new Intl.NumberFormat("en").format(pack.size);
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

const required = [
  "bin/cli.js",
  "src/index.js",
  "fixtures/manifest.json",
  "fixtures/sample-output.txt",
  "docs/CLI.md",
  "docs/LIMITATIONS.md",
  "docs/RELEASE_CANDIDATE.md",
  "SKILL.md",
  "README.md",
  "LICENSE",
  "SECURITY.md",
  "CONTRIBUTING.md",
  "CHANGELOG.md"
];

const missing = required.filter((file) => !files.has(file));
if (missing.length) {
  console.error(`Package smoke failed; missing files:\n${missing.join("\n")}`);
  process.exit(1);
}

if (packageJson.bin?.["artifact-evidence"] !== "./bin/cli.js") {
  console.error("Package smoke failed; artifact-evidence bin must point to ./bin/cli.js");
  process.exit(1);
}

if (packageJson.exports?.["."] !== "./src/index.js") {
  console.error("Package smoke failed; package export must expose ./src/index.js");
  process.exit(1);
}

const helpOutput = execFileSync(process.execPath, [packageJson.bin["artifact-evidence"], "--help"], {
  encoding: "utf8"
});
if (!helpOutput.includes("Usage: artifact-evidence")) {
  console.error("Package smoke failed; artifact-evidence --help did not print usage text");
  process.exit(1);
}

const unknownOption = spawnSync(process.execPath, [
  packageJson.bin["artifact-evidence"],
  "fixtures/manifest.json",
  "--format=json"
], {
  encoding: "utf8"
});
if (unknownOption.status !== 2 || !unknownOption.stderr.includes("Unknown option: --format=json")) {
  console.error("Package smoke failed; artifact-evidence must reject unknown options with exit code 2");
  process.exit(1);
}

const importOutput = execFileSync(process.execPath, [
  "--input-type=module",
  "-e",
  "import('./src/index.js').then((mod) => { if (typeof mod.loadPacket !== 'function' || typeof mod.renderMarkdown !== 'function') process.exit(1); })"
], {
  encoding: "utf8"
});
if (importOutput.trim()) {
  console.error("Package smoke failed; package import smoke produced unexpected output");
  process.exit(1);
}

if (packageJson.repository?.url !== "git+https://github.com/rogerchappel/artifact-evidence-skill.git") {
  console.error("Package smoke failed; repository metadata does not point at the public GitHub repo");
  process.exit(1);
}

console.log(
  `package smoke ok: ${pack.filename} includes ${pack.files.length} files (${packageSize} bytes)`
);

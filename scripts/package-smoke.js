import { execFileSync } from "node:child_process";
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

if (packageJson.repository?.url !== "git+https://github.com/rogerchappel/artifact-evidence-skill.git") {
  console.error("Package smoke failed; repository metadata does not point at the public GitHub repo");
  process.exit(1);
}

console.log(
  `package smoke ok: ${pack.filename} includes ${pack.files.length} files (${packageSize} bytes)`
);

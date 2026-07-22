import { readFileSync } from "node:fs";

const sourceUrl = "https://raw.githubusercontent.com/petebot/portfolio26/main/DESIGN_SYSTEM_CONTRACT.md";
const adoptionSourceUrl = "https://raw.githubusercontent.com/petebot/portfolio26/codex/design-system-contract/DESIGN_SYSTEM_CONTRACT.md";
const localContract = readFileSync(new URL("../DESIGN_SYSTEM_CONTRACT.md", import.meta.url), "utf8");

function declaredVersion(source, label) {
  const match = source.match(/\*\*Version:\*\*\s+([^\s]+)/);
  if (!match) throw new Error(`${label} does not declare a contract version.`);
  return match[1];
}

let response = await fetch(sourceUrl);
if (response.status === 404) {
  console.warn("Canonical contract is not published on main yet; checking the reviewed adoption branch.");
  response = await fetch(adoptionSourceUrl);
}
if (!response.ok) {
  throw new Error(`Could not read the upstream contract (${response.status} ${response.statusText}).`);
}

const localVersion = declaredVersion(localContract, "Local contract");
const canonicalVersion = declaredVersion(await response.text(), "Canonical contract");

if (localVersion !== canonicalVersion) {
  console.error(`Design-system contract update available: local ${localVersion}, canonical ${canonicalVersion}.`);
  console.error("Review the upstream contract and adopt it deliberately; do not replace the local copy silently.");
  process.exit(1);
}

console.log(`Design-system contract is current (${localVersion}).`);

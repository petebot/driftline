import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const mode = process.argv[2] ?? "--all";
const failures = [];

function read(path) {
  const absolute = resolve(root, path);
  if (!existsSync(absolute)) {
    failures.push(`Missing required artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
}

function requireMatch(source, pattern, message) {
  if (!pattern.test(source)) failures.push(message);
}

const contract = read("DESIGN_SYSTEM_CONTRACT.md");
const documentation = read("docs/design-system.md");
const css = read("src/app/globals.css");
const shell = read("src/components/driftline/app-shell.tsx");
const dialog = read("src/components/driftline/action-dialog.tsx");
const portfolio = read("src/components/driftline/portfolio-page.tsx");
const people = read("src/components/driftline/people-page.tsx");
const specimenRoute = read("src/app/system/page.tsx");
const specimen = read("src/components/driftline/design-system-page.tsx");
const handoff = read("docs/portfolio-handoff.json");

requireMatch(contract, /Version:\*\* 1\.0\.0/, "Contract version 1.0.0 is not present.");
requireMatch(documentation, /Contract version followed:\*\* 1\.0\.0/, "Project documentation must record contract version 1.0.0.");
requireMatch(documentation, /raw\.githubusercontent\.com\/petebot\/portfolio26\/main\/DESIGN_SYSTEM_CONTRACT\.md/, "Project documentation must record the canonical contract source.");
requireMatch(documentation, /System status:\*\* living/, "Project documentation must record the system status.");
requireMatch(handoff, /"contractVersion": "1\.0\.0"/, "Portfolio handoff must record contract version 1.0.0.");
requireMatch(handoff, /"status": "living"/, "Portfolio handoff must record the system status.");

const requiredTokens = [
  "--paper", "--surface-raised", "--ink", "--muted", "--line", "--focus-ring",
  "--text-xs", "--text-base", "--space-1", "--space-8", "--layout-content",
  "--radius-sm", "--radius-lg", "--shadow", "--motion-fast", "--ease-standard",
  "--layer-dialog", "--layer-toast", "--control-height",
];
for (const token of requiredTokens) {
  if (!css.includes(`${token}:`)) failures.push(`Missing required semantic token: ${token}`);
}

for (const match of css.matchAll(/font-size:\s*([0-9.]+)px/g)) {
  if (Number(match[1]) < 12) failures.push(`Type below the 12px floor: ${match[0]}`);
}
requireMatch(css, /@media \(prefers-color-scheme: dark\)/, "System dark theme is missing.");
requireMatch(css, /@media \(prefers-reduced-motion: reduce\)/, "Reduced-motion behavior is missing.");
requireMatch(css, /@media \(forced-colors: active\)/, "Forced-color behavior is missing.");
if (/outline:\s*(?:0|none)/.test(css)) failures.push("A focus outline is removed without a system replacement.");

if (mode === "--a11y" || mode === "--all") {
  requireMatch(shell, /className="skip-link"/, "Skip navigation is missing.");
  requireMatch(shell, /<main id="main-content"/, "The main landmark is missing.");
  requireMatch(shell, /aria-current=/, "Current navigation state is not exposed.");
  requireMatch(dialog, /role="dialog"/, "The action dialog role is missing.");
  requireMatch(dialog, /event\.key === "Escape"/, "The action dialog must close with Escape.");
  requireMatch(`${portfolio}${people}${dialog}`, /role="progressbar"/, "Progress values are not exposed semantically.");
  requireMatch(`${portfolio}${people}${specimen}`, /aria-pressed=/, "Selection state is not exposed with aria-pressed.");
}

if (mode === "--visual" || mode === "--all") {
  requireMatch(specimenRoute, /DesignSystemPage/, "The visual specimen route is not connected.");
  for (const section of ["Design principles", "Semantic color", "Type with instrument precision", "Components and states", "Explainable attention routing"]) {
    if (!specimen.includes(section)) failures.push(`Visual specimen is missing: ${section}`);
  }
  requireMatch(css, /\/\* Design-system specimen \*\//, "The visual specimen styles are missing.");
}

if (failures.length > 0) {
  console.error(`Design-system check failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Design-system check passed (${mode.replace("--", "")}).`);

/**
 * One-shot migration from the original fixed palette to the semantic tokens in
 * globals.css. Kept in the repo only as a record of what was rewritten; it is not
 * part of any npm script and does nothing on a second run.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src", import.meta.url));

// Order matters: the longest and most specific patterns have to go first, or a
// shorter one eats the prefix and leaves a half-rewritten class behind.
const replacements = [
  // Surfaces
  ["bg-white/[0.035]", "bg-panel"],
  ["bg-white/[0.04]", "bg-panel"],
  ["bg-white/[0.06]", "bg-panel-2"],
  ["bg-white/[0.07]", "bg-panel-2"],
  ["bg-white/[0.015]", "bg-panel/60"],
  ["bg-white/5", "bg-panel"],
  ["bg-white/6", "bg-panel-2"],
  ["bg-white/8", "bg-panel-2"],
  ["bg-white/10", "bg-panel-2"],

  // Hairlines and rules
  ["border-white/8", "border-line"],
  ["border-white/10", "border-line"],
  ["border-white/15", "border-line"],
  ["divide-white/10", "divide-line"],
  ["from-white/25", "from-line-strong"],

  // Accent
  ["bg-signal-300", "bg-accent"],
  ["bg-signal-400", "bg-accent"],
  ["bg-signal-200", "bg-accent-strong"],
  ["text-signal-300", "text-accent"],
  ["text-signal-400", "text-accent"],
  ["text-signal-600", "text-accent"],
  ["accent-signal-400", "accent-[var(--c-accent)]"],
  ["bg-signal-500", "bg-accent-glow"],
  ["bg-signal-400/40", "bg-accent/40"],

  // The violet secondary is gone; the second glow is the brand blue instead.
  ["bg-pulse-500", "bg-accent-glow"],
  ["bg-pulse-400", "bg-accent-glow"],
  ["text-pulse-300", "text-accent"],

  // Type
  ["text-ink-1000", "text-on-accent"],
  ["text-ink-100", "text-body"],
  ["text-ink-200", "text-body"],
  ["text-ink-300", "text-muted"],
  ["text-ink-400", "text-muted"],
  ["text-ink-500", "text-faint"],
  ["text-ink-600", "text-faint"],
  ["text-ink-700", "text-faint"],
  ["placeholder:text-ink-500", "placeholder:text-faint"],

  // Plates
  ["bg-ink-1000", "bg-page"],
  ["bg-ink-950", "bg-panel-solid"],
  ["bg-ink-900", "bg-panel-solid"],
  ["bg-ink-800", "bg-panel-solid"],

  // Headings and anything that was hard-coded white
  ["text-white", "text-heading"],
  ["hover:text-white", "hover:text-heading"],
  ["group-hover:text-white", "group-hover:text-heading"],
  ["focus:text-white", "focus:text-heading"],
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(tsx|ts)$/.test(entry)) out.push(full);
  }
  return out;
}

let touched = 0;

for (const file of walk(root)) {
  const original = readFileSync(file, "utf8");
  let next = original;

  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }

  if (next !== original) {
    writeFileSync(file, next);
    touched += 1;
    console.log("rewrote", file.slice(root.length + 1));
  }
}

console.log(`\n${touched} file(s) rewritten.`);

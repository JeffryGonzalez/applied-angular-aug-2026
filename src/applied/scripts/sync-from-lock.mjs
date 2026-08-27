#!/usr/bin/env node
// Rewrite package.json dependency ranges to the versions actually installed,
// keeping each range's existing operator (^, ~, >=, exact, ...).
// Usage: node sync-from-lock.mjs [--write]
import { readFileSync, writeFileSync } from 'node:fs';

const WRITE = process.argv.includes('--write');
const FIELDS = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
];

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));

if (lock.lockfileVersion < 2) {
  console.error('Needs lockfileVersion 2 or 3 (npm 7+).');
  process.exit(1);
}

// Only touch a plain range like "^1.2.3" / "~1.2" / "1.2.3" / ">=1.2.3".
// Leaves alone: "*", "latest", "npm:alias@1", "workspace:*", git/file URLs,
// and compound ranges with || or spaces.
const SIMPLE = /^(\^|~|>=|>|<=|<|=)?\d+\.\d+\.\d+.*$/;

const changes = [];
for (const field of FIELDS) {
  const deps = pkg[field];
  if (!deps) continue;
  for (const [name, range] of Object.entries(deps)) {
    if (!SIMPLE.test(range) || /\s|\|\|/.test(range)) continue;
    const installed = lock.packages?.[`node_modules/${name}`]?.version;
    if (!installed) continue;
    const prefix = range.match(/^(\^|~|>=|>|<=|<|=)?/)[0];
    const next = prefix + installed;
    if (next !== range) {
      deps[name] = next;
      changes.push({ field, name, from: range, to: next });
    }
  }
}

if (!changes.length) {
  console.log('Already in sync.');
  process.exit(0);
}

const width = Math.max(...changes.map((c) => c.name.length));
for (const c of changes) {
  console.log(`${c.name.padEnd(width)}  ${c.from}  ->  ${c.to}`);
}

if (WRITE) {
  writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
  console.log(`\nWrote package.json (${changes.length} changed).`);
} else {
  console.log(`\n${changes.length} would change. Re-run with --write.`);
}

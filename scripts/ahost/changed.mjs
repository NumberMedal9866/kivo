// Compares deploy/site/.deploy-manifest.json with the manifest currently on
// the server and prepares an incremental upload:
//
//   deploy-changed/site/     only new or changed files, paths preserved
//   deploy-changed/removed   site-relative paths gone from the new build
//
// Usage: node scripts/ahost/changed.mjs <server-manifest.json>
// A missing or unreadable server manifest means "send everything".
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const MANIFEST = ".deploy-manifest.json";
const root = process.cwd();
const site = join(root, "deploy", "site");
const outRoot = join(root, "deploy-changed");
const out = join(outRoot, "site");

const read = (path) => {
  try {
    return JSON.parse(readFileSync(path, "utf8").replace(/^﻿/, ""));
  } catch {
    return null;
  }
};

const next = read(join(site, MANIFEST));
if (!next) {
  console.error("deploy/site has no manifest — run scripts/ahost/assemble.mjs first.");
  process.exit(1);
}
const serverPath = process.argv[2];
const prev = serverPath && existsSync(serverPath) ? read(serverPath) : null;

rmSync(outRoot, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const changed = Object.keys(next).filter((path) => !prev || prev[path] !== next[path]);
for (const path of changed) {
  mkdirSync(dirname(join(out, path)), { recursive: true });
  cpSync(join(site, path), join(out, path));
}

const removed = prev ? Object.keys(prev).filter((path) => !(path in next)) : [];
writeFileSync(join(outRoot, "removed"), removed.map((p) => `${p}\n`).join(""));

console.log(
  prev
    ? `${changed.length} new/changed, ${removed.length} removed, ` +
        `${Object.keys(next).length - changed.length} unchanged`
    : `No server manifest — uploading all ${changed.length} files`,
);

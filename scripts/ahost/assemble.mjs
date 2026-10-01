// Packages a standalone Next.js build (BUILD_STANDALONE=1 pnpm build) into
// the folder uploaded to the ahost application root:
//
//   deploy/
//     app.js                     Passenger startup file
//     site/                      .next/standalone + public + .next/static
//     site/.deploy-manifest.json path → content hash of every file in site/
//     tmp/restart.txt            new content every deploy → Passenger restarts
//
// Symlinks are dereferenced: FTP can't transfer them. The manifest lets the
// next deploy upload only what changed (scripts/ahost/changed.mjs) — ahost's
// FTP server doesn't preserve file times, so timestamp-based sync re-sends
// everything.
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, relative, sep } from "node:path";

const MANIFEST = ".deploy-manifest.json";

const root = process.cwd();
const out = join(root, "deploy");
const site = join(out, "site");
const standalone = join(root, ".next", "standalone");

if (!existsSync(join(standalone, "server.js"))) {
  console.error("No standalone build found — run `BUILD_STANDALONE=1 pnpm build` first.");
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "tmp"), { recursive: true });

const copy = (from, to) => cpSync(from, to, { recursive: true, dereference: true });
copy(standalone, site);
copy(join(root, "public"), join(site, "public"));
copy(join(root, ".next", "static"), join(site, ".next", "static"));
copy(join(root, "scripts", "ahost", "app.js"), join(out, "app.js"));

const manifest = {};
for (const entry of readdirSync(site, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const file = join(entry.parentPath, entry.name);
  const key = relative(site, file).split(sep).join("/");
  manifest[key] = createHash("sha1").update(readFileSync(file)).digest("hex");
}
writeFileSync(join(site, MANIFEST), JSON.stringify(manifest));

const stamp = `${process.env.GITHUB_SHA ?? "local"} ${new Date().toISOString()}\n`;
writeFileSync(join(out, "tmp", "restart.txt"), stamp);

console.log(`Assembled ${out}: ${Object.keys(manifest).length} files (${stamp.trim()})`);
